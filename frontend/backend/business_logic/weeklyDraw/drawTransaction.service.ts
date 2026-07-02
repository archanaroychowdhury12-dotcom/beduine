import {
  calculatePlanRoundWinnerCounts,
  executeWeeklyDraw,
  type DrawParticipant,
  type WeeklyDrawExecutionResult,
} from './weeklyDraw.service';
import { buildNonWinnerCreditEntry, resolvePlanFromMetadata } from '../services/nonWinnerCreditService';
import type { AppUserMetadata, CreditLedgerEntry, SupabaseRawUser } from '../types';

export type DrawCycleStatus = 'draft' | 'frozen' | 'running' | 'completed' | 'published' | 'cancelled';

export interface DrawCycleRecord {
  id: string;
  drawDate: string;
  status: DrawCycleStatus;
  totalEntries: number;
  verifiedEntries: number;
  winnerCount: number;
  rngSeedHash?: string;
  rngSeed?: string;
  reportHash?: string;
  report?: WeeklyDrawExecutionResult;
  lockedAt?: string;
  completedAt?: string;
  publishedAt?: string;
  nonWinnerCreditsIssuedAt?: string;
  runCount: number;
}

export interface DrawRepositoryTransaction {
  getCycleForUpdate(cycleId: string): Promise<DrawCycleRecord | null>;
  createOrUpdateCycle(cycle: DrawCycleRecord): Promise<void>;
  fetchEntriesForUpdate(cycleId: string): Promise<DrawParticipant[]>;
  upsertEntries(cycleId: string, participants: DrawParticipant[]): Promise<void>;
  writeDrawResult(cycleId: string, result: WeeklyDrawExecutionResult, hashes: { rngSeedHash: string; reportHash: string }): Promise<void>;
  markPublished(cycleId: string, publishedAt: string): Promise<void>;
  getNonWinnerUsersForCycle(cycleId: string): Promise<SupabaseRawUser[]>;
  insertCreditLedgerEntries(entries: Array<CreditLedgerEntry & { userId: string }>): Promise<void>;
  markNonWinnerCreditsIssued(cycleId: string, issuedAt: string): Promise<void>;
  insertAuditLog(event: { action: string; status: 'success' | 'failed' | 'pending'; reason: string; metadata?: Record<string, unknown> }): Promise<void>;
}

export interface DrawRepository {
  transaction<T>(handler: (tx: DrawRepositoryTransaction) => Promise<T>): Promise<T>;
}

export interface RunProductionDrawInput {
  cycleId: string;
  drawDate?: string;
  rngSeed: string;
  actorId: string;
  participants?: DrawParticipant[];
}

export interface PublishDrawInput {
  cycleId: string;
  actorId: string;
}

export interface IssueNonWinnerCreditsInput {
  cycleId: string;
  actorId: string;
}

async function sha256Hex(text: string): Promise<string> {
  const bytes = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

function normalizeDrawReportForHash(result: WeeklyDrawExecutionResult): string {
  return JSON.stringify({
    cycleId: result.cycleId,
    drawDate: result.drawDate,
    totalParticipants: result.totalParticipants,
    verifiedParticipants: result.verifiedParticipants,
    winnerCount: result.winnerCount,
    rounds: result.rounds,
    winnerIds: result.winners.map((w) => ({ id: w.id, uid: w.uid, ticketId: w.ticketId, rank: w.winnerRank, roundRank: w.roundWinnerRank, roundKey: w.planRoundKey, coupon: w.coupon })),
    nonWinnerIds: result.nonWinners.map((n) => n.id).sort(),
    rejectedIds: result.rejectedParticipants.map((r) => ({ id: r.id, reason: r.verification_reason })).sort((a, b) => a.id.localeCompare(b.id)),
  });
}

export async function hashDrawSeed(seed: string): Promise<string> {
  return `sha256:${await sha256Hex(seed)}`;
}

export async function hashDrawReport(result: WeeklyDrawExecutionResult): Promise<string> {
  return `sha256:${await sha256Hex(normalizeDrawReportForHash(result))}`;
}

export async function freezeEntriesInDb(
  repository: DrawRepository,
  cycleId: string,
  participants: DrawParticipant[],
  drawDate = new Date().toISOString(),
): Promise<DrawCycleRecord> {
  return repository.transaction(async (tx) => {
    const existing = await tx.getCycleForUpdate(cycleId);
    if (existing && !['draft', 'frozen'].includes(existing.status)) {
      throw new Error(`Cannot freeze cycle ${cycleId}; current status is ${existing.status}.`);
    }

    const verifiedEntries = participants.filter((p) => p.status === 'verified').length;
    const cycle: DrawCycleRecord = {
      id: cycleId,
      drawDate,
      status: 'frozen',
      totalEntries: participants.length,
      verifiedEntries,
      winnerCount: calculatePlanRoundWinnerCounts(participants.filter((p) => p.status === 'verified')).reduce((sum, round) => sum + round.winnerCount, 0),
      lockedAt: new Date().toISOString(),
      runCount: existing?.runCount || 0,
    };

    await tx.upsertEntries(cycleId, participants);
    await tx.createOrUpdateCycle(cycle);
    await tx.insertAuditLog({
      action: 'draw.entries_frozen',
      status: 'success',
      reason: `Weekly draw entries frozen for cycle ${cycleId}.`,
      metadata: { cycleId, totalEntries: participants.length, verifiedEntries: cycle.verifiedEntries },
    });
    return cycle;
  });
}

export async function runDrawOnceInTransaction(
  repository: DrawRepository,
  input: RunProductionDrawInput,
): Promise<WeeklyDrawExecutionResult & { rngSeedHash: string; reportHash: string }> {
  return repository.transaction(async (tx) => {
    const cycle = await tx.getCycleForUpdate(input.cycleId);
    if (!cycle) throw new Error(`Draw cycle ${input.cycleId} does not exist. Freeze entries before running the draw.`);
    if (cycle.status === 'completed' || cycle.status === 'published' || cycle.runCount > 0) {
      throw new Error(`Draw cycle ${input.cycleId} was already completed. Re-run is blocked.`);
    }
    if (cycle.status !== 'frozen') {
      throw new Error(`Draw cycle ${input.cycleId} must be frozen before running. Current status: ${cycle.status}.`);
    }

    await tx.createOrUpdateCycle({ ...cycle, status: 'running', runCount: cycle.runCount + 1 });
    const participants = input.participants || await tx.fetchEntriesForUpdate(input.cycleId);
    const result = executeWeeklyDraw({
      participants,
      cycleId: input.cycleId,
      drawDate: input.drawDate || cycle.drawDate,
      rngSeed: input.rngSeed,
    });
    const rngSeedHash = await hashDrawSeed(input.rngSeed);
    const reportHash = await hashDrawReport(result);

    await tx.writeDrawResult(input.cycleId, result, { rngSeedHash, reportHash });
    await tx.insertAuditLog({
      action: 'draw.completed_once',
      status: 'success',
      reason: `Weekly draw completed once for cycle ${input.cycleId}.`,
      metadata: {
        actorId: input.actorId,
        cycleId: input.cycleId,
        totalEntries: result.totalParticipants,
        verifiedEntries: result.verifiedParticipants,
        winnerCount: result.winnerCount,
        rngSeedHash,
        reportHash,
      },
    });

    return { ...result, rngSeedHash, reportHash };
  });
}

export async function publishDrawResult(repository: DrawRepository, input: PublishDrawInput): Promise<void> {
  await repository.transaction(async (tx) => {
    const cycle = await tx.getCycleForUpdate(input.cycleId);
    if (!cycle) throw new Error(`Draw cycle ${input.cycleId} does not exist.`);
    if (cycle.status !== 'completed') throw new Error(`Only completed draw cycles can be published. Current status: ${cycle.status}.`);
    const publishedAt = new Date().toISOString();
    await tx.markPublished(input.cycleId, publishedAt);
    await tx.insertAuditLog({
      action: 'draw.published',
      status: 'success',
      reason: `Draw result published for cycle ${input.cycleId}.`,
      metadata: { actorId: input.actorId, cycleId: input.cycleId, publishedAt, reportHash: cycle.reportHash },
    });
  });
}

function userIdFromMetadata(user: SupabaseRawUser): string {
  return user.id;
}

function buildIssuedCreditEntriesForUser(user: SupabaseRawUser, cycleId: string): Array<CreditLedgerEntry & { userId: string }> {
  const metadata: AppUserMetadata = user.user_metadata || {};
  const plan = resolvePlanFromMetadata(metadata);
  if (!plan) return [];
  const entry = buildNonWinnerCreditEntry({
    category: plan.category,
    cycleId,
    creditCount: plan.discountCredits,
    source: metadata.subscription_source === 'real' ? 'real' : 'demo',
  });
  return [{ ...entry, userId: userIdFromMetadata(user) }];
}

export async function issueNonWinnerCreditsAfterResult(
  repository: DrawRepository,
  input: IssueNonWinnerCreditsInput,
): Promise<{ issuedUsers: number; issuedEntries: number }> {
  return repository.transaction(async (tx) => {
    const cycle = await tx.getCycleForUpdate(input.cycleId);
    if (!cycle) throw new Error(`Draw cycle ${input.cycleId} does not exist.`);
    if (!['completed', 'published'].includes(cycle.status)) {
      throw new Error(`Non-winner credits can be issued only after draw result is completed/published. Current status: ${cycle.status}.`);
    }
    if (cycle.nonWinnerCreditsIssuedAt) {
      throw new Error(`Non-winner credits already issued for cycle ${input.cycleId}.`);
    }

    const users = await tx.getNonWinnerUsersForCycle(input.cycleId);
    const entries = users.flatMap((user) => buildIssuedCreditEntriesForUser(user, input.cycleId));
    await tx.insertCreditLedgerEntries(entries);
    const issuedAt = new Date().toISOString();
    await tx.markNonWinnerCreditsIssued(input.cycleId, issuedAt);
    await tx.insertAuditLog({
      action: 'draw.non_winner_credits_issued',
      status: 'success',
      reason: `Non-winner Discount Credits issued for cycle ${input.cycleId}.`,
      metadata: { actorId: input.actorId, cycleId: input.cycleId, issuedUsers: users.length, issuedEntries: entries.length, issuedAt },
    });

    return { issuedUsers: users.length, issuedEntries: entries.length };
  });
}

import { describe, expect, it } from 'vitest';
import type { SupabaseRawUser } from '../business_logic/types';
import type { DrawParticipant } from '../business_logic/weeklyDraw/weeklyDraw.service';
import {
  type DrawCycleRecord,
  type DrawRepository,
  type DrawRepositoryTransaction,
  freezeEntriesInDb,
  issueNonWinnerCreditsAfterResult,
  publishDrawResult,
  runDrawOnceInTransaction,
} from '../business_logic/weeklyDraw/drawTransaction.service';

function participant(id: number): DrawParticipant {
  return {
    id: `u-${id}`,
    name: `User ${id}`,
    email: `u${id}@example.com`,
    phone: String(id),
    plan: id % 2 === 0 ? 'Gold Plan' : 'Silver Plan',
    subscription_status: 'active',
    payment_status: 'paid',
    weekly_entry_status: 'valid',
    account_status: 'active',
    is_duplicate: false,
    ticketId: '',
    status: 'verified',
    verification_reason: '',
  };
}

class InMemoryDrawRepo implements DrawRepository, DrawRepositoryTransaction {
  cycles = new Map<string, DrawCycleRecord>();
  entries = new Map<string, DrawParticipant[]>();
  audits: unknown[] = [];
  credits: unknown[] = [];
  nonWinnerUsers: SupabaseRawUser[] = [];

  async transaction<T>(handler: (tx: DrawRepositoryTransaction) => Promise<T>): Promise<T> { return handler(this); }
  async getCycleForUpdate(cycleId: string) { return this.cycles.get(cycleId) || null; }
  async createOrUpdateCycle(cycle: DrawCycleRecord) { this.cycles.set(cycle.id, cycle); }
  async fetchEntriesForUpdate(cycleId: string) { return this.entries.get(cycleId) || []; }
  async upsertEntries(cycleId: string, participants: DrawParticipant[]) { this.entries.set(cycleId, participants); }
  async writeDrawResult(cycleId: string, result: any, hashes: { rngSeedHash: string; reportHash: string }) {
    const cycle = this.cycles.get(cycleId)!;
    this.cycles.set(cycleId, { ...cycle, status: 'completed', report: result, rngSeedHash: hashes.rngSeedHash, reportHash: hashes.reportHash, completedAt: new Date().toISOString() });
  }
  async markPublished(cycleId: string, publishedAt: string) {
    const cycle = this.cycles.get(cycleId)!;
    this.cycles.set(cycleId, { ...cycle, status: 'published', publishedAt });
  }
  async getNonWinnerUsersForCycle() { return this.nonWinnerUsers; }
  async insertCreditLedgerEntries(entries: unknown[]) { this.credits.push(...entries); }
  async markNonWinnerCreditsIssued(cycleId: string, issuedAt: string) {
    const cycle = this.cycles.get(cycleId)!;
    this.cycles.set(cycleId, { ...cycle, nonWinnerCreditsIssuedAt: issuedAt });
  }
  async insertAuditLog(event: unknown) { this.audits.push(event); }
}

describe('production draw transaction workflow', () => {
  it('freezes, locks, runs once, publishes, and issues non-winner credits after result', async () => {
    const repo = new InMemoryDrawRepo();
    const participants = Array.from({ length: 21 }, (_, index) => participant(index + 1));

    const cycle = await freezeEntriesInDb(repo, 'SUN-001', participants, '2026-06-28T00:00:00.000Z');
    expect(cycle.status).toBe('frozen');
    expect(cycle.winnerCount).toBe(2);

    const result = await runDrawOnceInTransaction(repo, { cycleId: 'SUN-001', rngSeed: 'seed-001', actorId: 'admin-1' });
    expect(result.winners).toHaveLength(2);
    expect(repo.cycles.get('SUN-001')?.status).toBe('completed');
    expect(repo.cycles.get('SUN-001')?.reportHash).toMatch(/^sha256:[0-9a-f]{64}$/);

    await expect(runDrawOnceInTransaction(repo, { cycleId: 'SUN-001', rngSeed: 'seed-002', actorId: 'admin-1' }))
      .rejects.toThrow(/already completed/i);

    await publishDrawResult(repo, { cycleId: 'SUN-001', actorId: 'admin-1' });
    expect(repo.cycles.get('SUN-001')?.status).toBe('published');

    repo.nonWinnerUsers = [{
      id: 'u-3',
      email: 'u3@example.com',
      user_metadata: {
        planName: 'Gold Plan',
        planType: 'domestic',
        subscriptionStatus: 'active',
        subscription_payment_record: { payment_status: 'success' },
        weekly_participation_cycle_id: 'SUN-001',
        weekly_participation_status: 'non_winner',
        ledger: [],
      },
    }];

    const issued = await issueNonWinnerCreditsAfterResult(repo, { cycleId: 'SUN-001', actorId: 'admin-1' });
    expect(issued.issuedUsers).toBe(1);
    expect(issued.issuedEntries).toBe(1);
    expect(repo.credits).toHaveLength(1);
    await expect(issueNonWinnerCreditsAfterResult(repo, { cycleId: 'SUN-001', actorId: 'admin-1' }))
      .rejects.toThrow(/already issued/i);
  });
});

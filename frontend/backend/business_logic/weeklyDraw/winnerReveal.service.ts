import type { DrawParticipant } from './weeklyDraw.service';

export interface WinnerRevealCycleRecord {
  id: string;
  status: 'completed' | 'published' | string;
  revealCursor: number;
  winnerCount: number;
  report?: { winners?: DrawParticipant[] } | null;
}

export interface RevealedWinner {
  cycleId: string;
  rank: number;
  name: string;
  uid: string;
  ticketId: string;
  coupon?: string;
  plan?: string;
  planRoundKey?: string;
  roundWinnerRank?: number;
  revealedAt: string;
  remainingWinners: number;
}

export interface WinnerRevealRepositoryTransaction {
  getCycleForRevealUpdate(cycleId: string): Promise<WinnerRevealCycleRecord | null>;
  markWinnerRevealed(input: { cycleId: string; userId: string; rank: number; revealedAt: string }): Promise<void>;
  updateRevealCursor(cycleId: string, revealCursor: number): Promise<void>;
  insertAuditLog(event: { action: string; status: 'success' | 'failed' | 'pending'; reason: string; metadata?: Record<string, unknown> }): Promise<void>;
}

export interface WinnerRevealRepository {
  transaction<T>(handler: (tx: WinnerRevealRepositoryTransaction) => Promise<T>): Promise<T>;
}

export interface RevealNextWinnerInput {
  cycleId: string;
  actorId: string;
  now?: string;
}

function getWinnerUid(winner: DrawParticipant): string {
  const participantWithUid = winner as DrawParticipant & { uid?: string; memberUid?: string; memberId?: string };
  return participantWithUid.uid || participantWithUid.memberUid || participantWithUid.memberId || winner.id;
}

export function getWinnerAtRevealCursor(cycle: WinnerRevealCycleRecord): DrawParticipant | null {
  const winners = cycle.report?.winners || [];
  if (cycle.revealCursor < 0) return null;
  return winners[cycle.revealCursor] || null;
}

export async function revealNextWinner(
  repository: WinnerRevealRepository,
  input: RevealNextWinnerInput,
): Promise<RevealedWinner | null> {
  return repository.transaction(async (tx) => {
    const cycle = await tx.getCycleForRevealUpdate(input.cycleId);
    if (!cycle) throw new Error(`Draw cycle ${input.cycleId} does not exist.`);
    if (!['completed', 'published'].includes(cycle.status)) {
      throw new Error(`Winners can be revealed only after draw completion. Current status: ${cycle.status}.`);
    }

    const winner = getWinnerAtRevealCursor(cycle);
    if (!winner) {
      await tx.insertAuditLog({
        action: 'draw.reveal_next_winner.no_more_winners',
        status: 'success',
        reason: `No more winners left to reveal for cycle ${input.cycleId}.`,
        metadata: { actorId: input.actorId, cycleId: input.cycleId, revealCursor: cycle.revealCursor },
      });
      return null;
    }

    const revealedAt = input.now || new Date().toISOString();
    const rank = winner.winnerRank || cycle.revealCursor + 1;
    await tx.markWinnerRevealed({ cycleId: input.cycleId, userId: winner.id, rank, revealedAt });
    await tx.updateRevealCursor(input.cycleId, cycle.revealCursor + 1);

    const output: RevealedWinner = {
      cycleId: input.cycleId,
      rank,
      name: winner.name,
      uid: getWinnerUid(winner),
      ticketId: winner.ticketId,
      coupon: winner.coupon,
      plan: winner.plan,
      planRoundKey: winner.planRoundKey,
      roundWinnerRank: winner.roundWinnerRank,
      revealedAt,
      remainingWinners: Math.max(0, (cycle.report?.winners || []).length - (cycle.revealCursor + 1)),
    };

    await tx.insertAuditLog({
      action: 'draw.winner_revealed_one_by_one',
      status: 'success',
      reason: `Winner #${rank} revealed for live draw cycle ${input.cycleId}.`,
      metadata: { actorId: input.actorId, ...output },
    });

    return output;
  });
}

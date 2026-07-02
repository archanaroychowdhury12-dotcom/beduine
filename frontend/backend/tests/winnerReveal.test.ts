import { describe, expect, it } from 'vitest';
import type { DrawParticipant } from '../business_logic/weeklyDraw/weeklyDraw.service';
import {
  revealNextWinner,
  type WinnerRevealCycleRecord,
  type WinnerRevealRepository,
  type WinnerRevealRepositoryTransaction,
} from '../business_logic/weeklyDraw/winnerReveal.service';

function winner(id: number): DrawParticipant {
  return {
    id: `u-${id}`,
    uid: `BDU-2026-U${id}`,
    name: `Winner ${id}`,
    email: `w${id}@example.com`,
    phone: String(id),
    plan: 'Gold Plan',
    subscription_status: 'active',
    payment_status: 'paid',
    weekly_entry_status: 'valid',
    account_status: 'active',
    is_duplicate: false,
    ticketId: `TRC-SUN-${id}`,
    status: 'verified',
    verification_reason: '',
    draw_result: 'winner',
    winnerRank: id,
    coupon: `BEDWIN-${id}`,
  };
}

class InMemoryRevealRepo implements WinnerRevealRepository, WinnerRevealRepositoryTransaction {
  cycle: WinnerRevealCycleRecord;
  revealed: Array<{ cycleId: string; userId: string; rank: number; revealedAt: string }> = [];
  audits: unknown[] = [];

  constructor(cycle: WinnerRevealCycleRecord) {
    this.cycle = cycle;
  }

  async transaction<T>(handler: (tx: WinnerRevealRepositoryTransaction) => Promise<T>): Promise<T> { return handler(this); }
  async getCycleForRevealUpdate() { return this.cycle; }
  async markWinnerRevealed(input: { cycleId: string; userId: string; rank: number; revealedAt: string }) { this.revealed.push(input); }
  async updateRevealCursor(_: string, revealCursor: number) { this.cycle = { ...this.cycle, revealCursor, revealedWinnerCount: revealCursor } as WinnerRevealCycleRecord; }
  async insertAuditLog(event: unknown) { this.audits.push(event); }
}

describe('winner one-by-one reveal backend logic', () => {
  it('reveals exactly one next winner per admin click with name and UID', async () => {
    const repo = new InMemoryRevealRepo({
      id: 'BEDUINE-SUN-2026-06-28-1800-IST',
      status: 'completed',
      revealCursor: 0,
      winnerCount: 2,
      report: { winners: [winner(1), winner(2)] },
    });

    const first = await revealNextWinner(repo, { cycleId: repo.cycle.id, actorId: 'admin-1', now: '2026-06-28T13:00:00.000Z' });
    expect(first?.name).toBe('Winner 1');
    expect(first?.uid).toBe('BDU-2026-U1');
    expect(first?.remainingWinners).toBe(1);

    const second = await revealNextWinner(repo, { cycleId: repo.cycle.id, actorId: 'admin-1', now: '2026-06-28T13:01:00.000Z' });
    expect(second?.name).toBe('Winner 2');
    expect(second?.uid).toBe('BDU-2026-U2');
    expect(second?.remainingWinners).toBe(0);

    const none = await revealNextWinner(repo, { cycleId: repo.cycle.id, actorId: 'admin-1' });
    expect(none).toBeNull();
    expect(repo.revealed).toHaveLength(2);
  });
});

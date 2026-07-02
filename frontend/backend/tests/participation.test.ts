import { describe, expect, it } from 'vitest';
import {
  participateInWeeklyDraw,
  type ParticipationRepository,
} from '../business_logic/weeklyDraw/participation.service';

function createRepository(): ParticipationRepository & {
  entries: Array<{ cycleId: string; userId: string; ticketId: string }>;
  lockedTrcIds: string[];
} {
  const entries: Array<{ cycleId: string; userId: string; ticketId: string }> = [];
  const lockedTrcIds: string[] = [];
  let ticketSequence = 90;

  return {
    entries,
    lockedTrcIds,
    async transaction(work) {
      return work(this);
    },
    async findActiveSubscription() {
      return {
        id: 'subscription-1',
        planId: 'domestic_gold',
        category: 'domestic',
        tier: 'gold',
      };
    },
    async findAvailableTrc() {
      return { id: 'trc-1' };
    },
    async findEntry(cycleId, userId) {
      return entries.find((entry) => (
        entry.cycleId === cycleId && entry.userId === userId
      )) ?? null;
    },
    async nextTicketId() {
      ticketSequence += 1;
      return `TRC-SUN-${String(ticketSequence).padStart(5, '0')}`;
    },
    async lockTrc(trcId) {
      lockedTrcIds.push(trcId);
    },
    async createEntry(entry) {
      entries.push(entry);
    },
  };
}

describe('weekly draw participation', () => {
  it('locks one TRC and creates one ticket', async () => {
    const repository = createRepository();
    const result = await participateInWeeklyDraw(repository, {
      userId: 'user-1',
      now: new Date('2026-07-05T11:00:00.000Z'),
    });

    expect(result.ticketId).toMatch(/^TRC-SUN-[0-9]{5}$/);
    expect(repository.lockedTrcIds).toEqual(['trc-1']);
    expect(repository.entries).toHaveLength(1);
    expect(result.roundKey).toBe('domestic_gold');
  });

  it('rejects duplicate participation in one cycle', async () => {
    const repository = createRepository();
    const input = {
      userId: 'user-1',
      now: new Date('2026-07-05T11:00:00.000Z'),
    };

    await participateInWeeklyDraw(repository, input);
    await expect(
      participateInWeeklyDraw(repository, input),
    ).rejects.toThrow('ALREADY_PARTICIPATING');
  });
});

import { describe, expect, it } from 'vitest';
import {
  issuePersistentNonWinnerCredits,
  type NonWinnerCreditRepository,
  type NonWinnerDrawEntry,
} from '../business_logic/credits/persistentNonWinnerCredit.service';

function createRepository(
  entry: NonWinnerDrawEntry,
): NonWinnerCreditRepository & { units: number } {
  let issuedAt = entry.creditsIssuedAt;
  return {
    units: 0,
    async transaction(work) {
      return work(this);
    },
    async getEntryForUpdate() {
      return { ...entry, creditsIssuedAt: issuedAt };
    },
    async insertCreditUnits(input) {
      this.units += input.unitCount;
    },
    async markIssued(_cycleId, _userId, at) {
      issuedAt = at;
    },
  };
}

describe('persistent non-winner Discount Credit issuance', () => {
  it('issues Gold non-winner credits once', async () => {
    const repository = createRepository({
      cycleId: 'SUN-001',
      userId: 'user-1',
      drawResult: 'non_winner',
      roundKey: 'domestic_gold',
      creditsIssuedAt: null,
    });

    const first = await issuePersistentNonWinnerCredits(repository, {
      cycleId: 'SUN-001',
      userId: 'user-1',
      now: '2026-07-05T13:00:00.000Z',
    });
    const second = await issuePersistentNonWinnerCredits(repository, {
      cycleId: 'SUN-001',
      userId: 'user-1',
      now: '2026-07-05T13:01:00.000Z',
    });

    expect(first).toMatchObject({ issuedUnits: 2, duplicate: false });
    expect(second).toMatchObject({ issuedUnits: 0, duplicate: true });
    expect(repository.units).toBe(2);
  });
});

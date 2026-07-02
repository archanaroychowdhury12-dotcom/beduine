export type PersistentDrawRoundKey =
  | 'domestic_silver'
  | 'domestic_gold'
  | 'domestic_platinum'
  | 'international_silver'
  | 'international_gold'
  | 'international_platinum';

export interface NonWinnerDrawEntry {
  cycleId: string;
  userId: string;
  drawResult: 'winner' | 'non_winner' | 'not_eligible' | 'pending';
  roundKey: PersistentDrawRoundKey;
  creditsIssuedAt: string | null;
}

export interface NonWinnerCreditTransaction {
  getEntryForUpdate(
    cycleId: string,
    userId: string,
  ): Promise<NonWinnerDrawEntry | null>;
  insertCreditUnits(input: {
    cycleId: string;
    userId: string;
    category: 'domestic' | 'international';
    unitCount: number;
    unitValue: number;
  }): Promise<void>;
  markIssued(cycleId: string, userId: string, issuedAt: string): Promise<void>;
}

export interface NonWinnerCreditRepository extends NonWinnerCreditTransaction {
  transaction<T>(
    work: (transaction: NonWinnerCreditTransaction) => Promise<T>,
  ): Promise<T>;
}

export interface PersistentCreditIssuanceResult {
  cycleId: string;
  userId: string;
  issuedUnits: number;
  duplicate: boolean;
}

function policyForRound(roundKey: PersistentDrawRoundKey) {
  const [category, tier] = roundKey.split('_') as [
    'domestic' | 'international',
    'silver' | 'gold' | 'platinum',
  ];
  const unitCount = tier === 'platinum' ? 4 : tier === 'gold' ? 2 : 1;
  return {
    category,
    unitCount,
    unitValue: category === 'international' ? 5_000 : 500,
  };
}

export async function issuePersistentNonWinnerCredits(
  repository: NonWinnerCreditRepository,
  input: { cycleId: string; userId: string; now?: string },
): Promise<PersistentCreditIssuanceResult> {
  return repository.transaction(async (transaction) => {
    const entry = await transaction.getEntryForUpdate(
      input.cycleId,
      input.userId,
    );
    if (!entry) throw new Error('DRAW_ENTRY_NOT_FOUND');
    if (entry.drawResult === 'winner') throw new Error('WINNER_NOT_ELIGIBLE');
    if (entry.drawResult !== 'non_winner') throw new Error('NON_WINNER_NOT_FINAL');
    if (entry.creditsIssuedAt) {
      return {
        cycleId: input.cycleId,
        userId: input.userId,
        issuedUnits: 0,
        duplicate: true,
      };
    }

    const policy = policyForRound(entry.roundKey);
    await transaction.insertCreditUnits({
      cycleId: input.cycleId,
      userId: input.userId,
      ...policy,
    });
    await transaction.markIssued(
      input.cycleId,
      input.userId,
      input.now ?? new Date().toISOString(),
    );

    return {
      cycleId: input.cycleId,
      userId: input.userId,
      issuedUnits: policy.unitCount,
      duplicate: false,
    };
  });
}

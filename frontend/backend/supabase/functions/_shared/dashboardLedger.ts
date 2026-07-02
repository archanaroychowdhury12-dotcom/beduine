export interface CreditBalanceEntry {
  type: string;
  amount: number | string;
  created_at?: string;
}

export interface CreditBalances {
  available: number;
  locked: number;
}

function toAmount(value: number | string): number {
  const amount = Number(value);
  return Number.isFinite(amount) ? amount : 0;
}

export function computeCreditBalances(entries: CreditBalanceEntry[]): CreditBalances {
  const chronological = [...entries].sort((left, right) => {
    if (!left.created_at || !right.created_at) return 0;
    return left.created_at.localeCompare(right.created_at);
  });

  let available = 0;
  let locked = 0;

  for (const entry of chronological) {
    const amount = toAmount(entry.amount);
    if (amount <= 0) continue;

    if (entry.type === 'issued' || entry.type === 'admin_adjustment') {
      available += amount;
      continue;
    }

    if (entry.type === 'reserved') {
      available -= amount;
      locked += amount;
      continue;
    }

    if (entry.type === 'redeemed') {
      const redeemedFromLock = Math.min(locked, amount);
      locked -= redeemedFromLock;
      available -= amount - redeemedFromLock;
      continue;
    }

    if (entry.type === 'reversed') {
      locked = Math.max(0, locked - amount);
      available += amount;
      continue;
    }

    if (entry.type === 'expired') {
      const expiredFromLock = Math.min(locked, amount);
      locked -= expiredFromLock;
      available -= amount - expiredFromLock;
    }
  }

  return {
    available: Math.max(0, available),
    locked: Math.max(0, locked),
  };
}

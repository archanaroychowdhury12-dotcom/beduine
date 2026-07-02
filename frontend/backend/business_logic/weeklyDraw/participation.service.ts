import { getNextSundayFreezeSchedule } from './weeklyDrawSchedule.service';

export type ParticipationRoundKey =
  | 'domestic_silver'
  | 'domestic_gold'
  | 'domestic_platinum'
  | 'international_silver'
  | 'international_gold'
  | 'international_platinum';

export interface ParticipationSubscription {
  id: string;
  planId: string;
  category: 'domestic' | 'international';
  tier: 'silver' | 'gold' | 'platinum';
}

export interface ParticipationTransaction {
  findActiveSubscription(
    userId: string,
    now: Date,
  ): Promise<ParticipationSubscription | null>;
  findAvailableTrc(userId: string): Promise<{ id: string } | null>;
  findEntry(
    cycleId: string,
    userId: string,
  ): Promise<{ ticketId: string } | null>;
  nextTicketId(): Promise<string>;
  lockTrc(trcId: string, cycleId: string): Promise<void>;
  createEntry(entry: {
    cycleId: string;
    userId: string;
    ticketId: string;
    subscriptionId: string;
    planId: string;
    roundKey: ParticipationRoundKey;
    trcId: string;
  }): Promise<void>;
}

export interface ParticipationRepository extends ParticipationTransaction {
  transaction<T>(
    work: (transaction: ParticipationTransaction) => Promise<T>,
  ): Promise<T>;
}

export interface ParticipationResponse {
  cycleId: string;
  ticketId: string;
  roundKey: ParticipationRoundKey;
  freezeAtIso: string;
}

export async function participateInWeeklyDraw(
  repository: ParticipationRepository,
  input: { userId: string; now?: Date },
): Promise<ParticipationResponse> {
  const now = input.now ?? new Date();
  const schedule = getNextSundayFreezeSchedule(now);

  return repository.transaction(async (transaction) => {
    const existing = await transaction.findEntry(schedule.cycleId, input.userId);
    if (existing) throw new Error('ALREADY_PARTICIPATING');

    const subscription = await transaction.findActiveSubscription(input.userId, now);
    if (!subscription) throw new Error('SUBSCRIPTION_INACTIVE');

    const trc = await transaction.findAvailableTrc(input.userId);
    if (!trc) throw new Error('NO_TRC_AVAILABLE');

    const ticketId = await transaction.nextTicketId();
    if (!/^TRC-SUN-[0-9]{5,}$/.test(ticketId)) {
      throw new Error('TICKET_SEQUENCE_INVALID');
    }

    const roundKey =
      `${subscription.category}_${subscription.tier}` as ParticipationRoundKey;
    await transaction.lockTrc(trc.id, schedule.cycleId);
    await transaction.createEntry({
      cycleId: schedule.cycleId,
      userId: input.userId,
      ticketId,
      subscriptionId: subscription.id,
      planId: subscription.planId,
      roundKey,
      trcId: trc.id,
    });

    return {
      cycleId: schedule.cycleId,
      ticketId,
      roundKey,
      freezeAtIso: schedule.freezeAtUtc,
    };
  });
}

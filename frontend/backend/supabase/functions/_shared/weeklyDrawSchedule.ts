const IST_OFFSET_MINUTES = 330;
const SUNDAY_FREEZE_HOUR_IST = 18;

export interface EdgeWeeklyDrawSchedule {
  cycleId: string;
  freezeAtIso: string;
}

function pad2(value: number): string {
  return String(value).padStart(2, '0');
}

function toIstDate(now: Date): Date {
  return new Date(now.getTime() + IST_OFFSET_MINUTES * 60_000);
}

function scheduleFromIstDate(ist: Date, dayOffset: number): EdgeWeeklyDrawSchedule {
  const midnightUtc = Date.UTC(
    ist.getUTCFullYear(),
    ist.getUTCMonth(),
    ist.getUTCDate() + dayOffset,
    0,
    0,
    0,
  ) - IST_OFFSET_MINUTES * 60_000;
  const freezeAt = new Date(
    midnightUtc + SUNDAY_FREEZE_HOUR_IST * 60 * 60_000,
  );
  const freezeAtIst = toIstDate(freezeAt);
  const dateKey = [
    freezeAtIst.getUTCFullYear(),
    pad2(freezeAtIst.getUTCMonth() + 1),
    pad2(freezeAtIst.getUTCDate()),
  ].join('-');

  return {
    cycleId: `BEDUINE-SUN-${dateKey}-1800-IST`,
    freezeAtIso: freezeAt.toISOString(),
  };
}

export function getMostRecentSundaySchedule(
  now = new Date(),
): EdgeWeeklyDrawSchedule {
  const ist = toIstDate(now);
  return scheduleFromIstDate(ist, -ist.getUTCDay());
}

export function getStatusCycleSchedule(
  now = new Date(),
): EdgeWeeklyDrawSchedule {
  const ist = toIstDate(now);
  const day = ist.getUTCDay();
  return scheduleFromIstDate(ist, day === 0 ? 0 : 7 - day);
}

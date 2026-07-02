import type { DrawCycleStatus } from './drawTransaction.service';

export const IST_OFFSET_MINUTES = 330;
export const SUNDAY_DAY_INDEX = 0;
export const DEFAULT_FREEZE_HOUR_IST = 18;
export const DEFAULT_FREEZE_MINUTE_IST = 0;

export interface WeeklyDrawFreezeConfig {
  /** Fixed offset minutes. India currently uses IST UTC+05:30. */
  timezoneOffsetMinutes: number;
  freezeDayOfWeek: number;
  freezeHour: number;
  freezeMinute: number;
  cyclePrefix: string;
}

export interface WeeklyDrawCycleSchedule {
  cycleId: string;
  freezeAtUtc: string;
  freezeAtIstLabel: string;
  sundayDateKeyIst: string;
}

export interface AutoFreezeDecision {
  shouldFreeze: boolean;
  reason: string;
  schedule: WeeklyDrawCycleSchedule;
}

export const DEFAULT_WEEKLY_DRAW_FREEZE_CONFIG: WeeklyDrawFreezeConfig = {
  timezoneOffsetMinutes: IST_OFFSET_MINUTES,
  freezeDayOfWeek: SUNDAY_DAY_INDEX,
  freezeHour: DEFAULT_FREEZE_HOUR_IST,
  freezeMinute: DEFAULT_FREEZE_MINUTE_IST,
  cyclePrefix: 'BEDUINE-SUN',
};

function pad2(value: number): string {
  return String(value).padStart(2, '0');
}

function toZonedDate(utcDate: Date, offsetMinutes: number): Date {
  return new Date(utcDate.getTime() + offsetMinutes * 60_000);
}

function zonedPartsToUtc(parts: { year: number; month: number; day: number; hour: number; minute: number; second?: number }, offsetMinutes: number): Date {
  return new Date(Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second || 0) - offsetMinutes * 60_000);
}

function getZonedDateParts(utcDate: Date, offsetMinutes: number) {
  const zoned = toZonedDate(utcDate, offsetMinutes);
  return {
    year: zoned.getUTCFullYear(),
    month: zoned.getUTCMonth() + 1,
    day: zoned.getUTCDate(),
    dayOfWeek: zoned.getUTCDay(),
    hour: zoned.getUTCHours(),
    minute: zoned.getUTCMinutes(),
  };
}

function addDaysInZonedDate(parts: { year: number; month: number; day: number }, days: number, offsetMinutes: number): { year: number; month: number; day: number } {
  const utc = zonedPartsToUtc({ ...parts, hour: 0, minute: 0 }, offsetMinutes);
  const moved = new Date(utc.getTime() + days * 24 * 60 * 60 * 1000);
  const zoned = getZonedDateParts(moved, offsetMinutes);
  return { year: zoned.year, month: zoned.month, day: zoned.day };
}

export function getMostRecentSundayFreezeSchedule(
  now = new Date(),
  config: WeeklyDrawFreezeConfig = DEFAULT_WEEKLY_DRAW_FREEZE_CONFIG,
): WeeklyDrawCycleSchedule {
  const parts = getZonedDateParts(now, config.timezoneOffsetMinutes);
  const daysSinceSunday = (parts.dayOfWeek - config.freezeDayOfWeek + 7) % 7;
  const sunday = addDaysInZonedDate({ year: parts.year, month: parts.month, day: parts.day }, -daysSinceSunday, config.timezoneOffsetMinutes);
  const freezeAt = zonedPartsToUtc({ ...sunday, hour: config.freezeHour, minute: config.freezeMinute }, config.timezoneOffsetMinutes);
  const sundayDateKeyIst = `${sunday.year}-${pad2(sunday.month)}-${pad2(sunday.day)}`;
  const hh = pad2(config.freezeHour);
  const mm = pad2(config.freezeMinute);

  return {
    cycleId: `${config.cyclePrefix}-${sundayDateKeyIst}-${hh}${mm}-IST`,
    freezeAtUtc: freezeAt.toISOString(),
    freezeAtIstLabel: `${sundayDateKeyIst} ${hh}:${mm} IST`,
    sundayDateKeyIst,
  };
}

export function getNextSundayFreezeSchedule(
  now = new Date(),
  config: WeeklyDrawFreezeConfig = DEFAULT_WEEKLY_DRAW_FREEZE_CONFIG,
): WeeklyDrawCycleSchedule {
  const current = getMostRecentSundayFreezeSchedule(now, config);
  const currentFreeze = new Date(current.freezeAtUtc);
  if (now.getTime() < currentFreeze.getTime()) return current;

  const next = new Date(currentFreeze.getTime() + 7 * 24 * 60 * 60 * 1000);
  return getMostRecentSundayFreezeSchedule(next, config);
}

export function shouldAutoFreezeWeeklyDraw(input: {
  now?: Date;
  cycleStatus?: DrawCycleStatus | 'open' | 'draft' | null;
  alreadyAutoFrozenAt?: string | null;
  config?: WeeklyDrawFreezeConfig;
} = {}): AutoFreezeDecision {
  const now = input.now || new Date();
  const config = input.config || DEFAULT_WEEKLY_DRAW_FREEZE_CONFIG;
  const schedule = getMostRecentSundayFreezeSchedule(now, config);
  const freezeAt = new Date(schedule.freezeAtUtc);
  const nextFreezeAt = new Date(freezeAt.getTime() + 7 * 24 * 60 * 60 * 1000);
  const status = input.cycleStatus || 'draft';

  if (input.alreadyAutoFrozenAt) {
    return { shouldFreeze: false, reason: 'Cycle already auto-frozen.', schedule };
  }
  if (!['draft', 'open'].includes(status)) {
    return { shouldFreeze: false, reason: `Cycle status is ${status}; only draft/open cycles auto-freeze.`, schedule };
  }
  if (now.getTime() < freezeAt.getTime()) {
    return { shouldFreeze: false, reason: `Waiting until ${schedule.freezeAtIstLabel}.`, schedule };
  }
  if (now.getTime() >= nextFreezeAt.getTime()) {
    return { shouldFreeze: false, reason: 'Current time belongs to the next draw window; use the latest Sunday cycle.', schedule: getMostRecentSundayFreezeSchedule(now, config) };
  }

  return { shouldFreeze: true, reason: `Sunday 6:00 PM IST reached for ${schedule.cycleId}.`, schedule };
}

export function buildAutoFreezeAuditMetadata(decision: AutoFreezeDecision) {
  return {
    cycleId: decision.schedule.cycleId,
    freezeAtUtc: decision.schedule.freezeAtUtc,
    freezeAtIstLabel: decision.schedule.freezeAtIstLabel,
    sundayDateKeyIst: decision.schedule.sundayDateKeyIst,
    reason: decision.reason,
  };
}

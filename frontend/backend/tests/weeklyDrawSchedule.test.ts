import { describe, expect, it } from 'vitest';
import {
  getMostRecentSundayFreezeSchedule,
  getNextSundayFreezeSchedule,
  shouldAutoFreezeWeeklyDraw,
} from '../business_logic/weeklyDraw/weeklyDrawSchedule.service';

describe('weekly draw Sunday 6 PM IST schedule', () => {
  it('calculates the Sunday 6 PM IST cycle id and UTC freeze timestamp', () => {
    const atSundaySixIst = new Date('2026-06-28T12:30:00.000Z');
    const schedule = getMostRecentSundayFreezeSchedule(atSundaySixIst);

    expect(schedule.cycleId).toBe('BEDUINE-SUN-2026-06-28-1800-IST');
    expect(schedule.freezeAtUtc).toBe('2026-06-28T12:30:00.000Z');
    expect(schedule.freezeAtIstLabel).toBe('2026-06-28 18:00 IST');
  });

  it('freezes only after Sunday 6 PM IST and only once for draft/open cycles', () => {
    const before = shouldAutoFreezeWeeklyDraw({ now: new Date('2026-06-28T12:29:59.000Z'), cycleStatus: 'draft' });
    expect(before.shouldFreeze).toBe(false);

    const at = shouldAutoFreezeWeeklyDraw({ now: new Date('2026-06-28T12:30:00.000Z'), cycleStatus: 'draft' });
    expect(at.shouldFreeze).toBe(true);

    const already = shouldAutoFreezeWeeklyDraw({ now: new Date('2026-06-28T12:35:00.000Z'), cycleStatus: 'frozen' });
    expect(already.shouldFreeze).toBe(false);
  });

  it('returns the next Sunday freeze schedule after the current Sunday window starts', () => {
    const next = getNextSundayFreezeSchedule(new Date('2026-06-28T12:31:00.000Z'));
    expect(next.cycleId).toBe('BEDUINE-SUN-2026-07-05-1800-IST');
  });
});

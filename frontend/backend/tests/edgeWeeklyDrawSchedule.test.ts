import { describe, expect, it } from 'vitest';
import {
  getMostRecentSundaySchedule,
  getStatusCycleSchedule,
} from '../supabase/functions/_shared/weeklyDrawSchedule';

describe('Edge Function weekly draw schedule', () => {
  it('shows the upcoming Sunday cycle during the week', () => {
    const schedule = getStatusCycleSchedule(
      new Date('2026-07-02T10:30:00.000Z'),
    );

    expect(schedule.cycleId).toBe('BEDUINE-SUN-2026-07-05-1800-IST');
    expect(schedule.freezeAtIso).toBe('2026-07-05T12:30:00.000Z');
  });

  it('keeps the current Sunday cycle visible after the freeze time', () => {
    const schedule = getStatusCycleSchedule(
      new Date('2026-07-05T13:00:00.000Z'),
    );

    expect(schedule.cycleId).toBe('BEDUINE-SUN-2026-07-05-1800-IST');
  });

  it('gives the auto-freeze job the most recent Sunday', () => {
    const schedule = getMostRecentSundaySchedule(
      new Date('2026-07-05T13:00:00.000Z'),
    );

    expect(schedule.cycleId).toBe('BEDUINE-SUN-2026-07-05-1800-IST');
  });
});

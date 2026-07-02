import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AdminDrawOperations } from '@/features/admin/components/AdminDrawOperations';
import type { BeduineBackendAdapter } from '@/services/backend';

describe('AdminDrawOperations', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
  });

  it('loads the server draw status and reveals one server-selected winner', async () => {
    const backend = {
      getWeeklyDrawStatus: vi.fn().mockResolvedValue({
        cycleId: 'BEDUINE-SUN-2026-07-05-1800-IST',
        freezeAtIso: '2026-07-05T12:30:00.000Z',
        timezone: 'Asia/Kolkata',
        status: 'winner_pool_ready',
        canRevealNextWinner: true,
        rounds: [{
          roundKey: 'domestic_gold',
          label: 'Domestic Gold',
          category: 'domestic',
          tier: 'gold',
          participantCount: 20,
          winnerCount: 1,
          revealedCount: 0,
        }],
      }),
      revealNextWinner: vi.fn().mockResolvedValue({
        hasWinner: true,
        cycleId: 'BEDUINE-SUN-2026-07-05-1800-IST',
        roundKey: 'domestic_gold',
        planLabel: 'Domestic Gold',
        name: 'Rahul Sen',
        uid: 'BDU-2026-RHLSEN-4821',
        ticketId: 'TRC-SUN-00091',
        coupon: 'BEDWIN-2026-4821',
        remainingWinners: 0,
      }),
      issueNonWinnerCredits: vi.fn(),
    } as unknown as BeduineBackendAdapter;

    await act(async () => {
      root.render(<AdminDrawOperations backend={backend} mode="winner" />);
    });

    const revealButton = [...container.querySelectorAll('button')]
      .find((button) => button.textContent?.includes('Reveal Next Winner'));
    expect(revealButton).toBeDefined();

    await act(async () => {
      revealButton?.click();
    });

    expect(container.textContent).toContain('Rahul Sen');
    expect(container.textContent).toContain('BDU-2026-RHLSEN-4821');
    expect(backend.revealNextWinner).toHaveBeenCalledWith(
      'BEDUINE-SUN-2026-07-05-1800-IST',
    );
  });
});

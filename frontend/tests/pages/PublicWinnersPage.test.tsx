import { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import PublicWinnersPage from '@/pages/PublicWinnersPage';
import type { PublicWinnerSummary } from '@/services/backend';

describe('PublicWinnersPage', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
  });

  it('shows loading and then an empty published-results state', async () => {
    const loadWinners = vi.fn<() => Promise<PublicWinnerSummary[]>>()
      .mockResolvedValue([]);
    await act(async () => {
      root.render(<PublicWinnersPage loadWinners={loadWinners} />);
    });

    await act(async () => {
      await Promise.resolve();
    });

    expect(loadWinners).toHaveBeenCalledOnce();
    expect(container.textContent).toContain('No published winners yet');
  });

  it('renders the public projection without contact fields', async () => {
    const loadWinners = vi.fn<() => Promise<PublicWinnerSummary[]>>()
      .mockResolvedValue([{
        name: 'Rahul Sen',
        uid: 'BDU-2026-RHLSEN-4821',
        ticketId: 'TRC-SUN-00091',
        roundKey: 'domestic_gold',
        coupon: 'BEDWIN-2026-4821',
        resultDate: '2026-07-05T13:00:00.000Z',
      }]);
    await act(async () => {
      root.render(<PublicWinnersPage loadWinners={loadWinners} />);
    });

    expect(container.textContent).toContain('Rahul Sen');
    expect(container.textContent).toContain('BDU-2026-RHLSEN-4821');
    expect(container.textContent).toContain('TRC-SUN-00091');
    expect(container.textContent).not.toContain('rahul@example.com');
  });
});

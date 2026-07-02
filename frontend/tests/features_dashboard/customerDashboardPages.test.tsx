import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ModernDashboardApp } from '@/features/dashboard/modern/ModernDashboardApp';
import type { CustomerDashboardResponse } from '@/services/backend';

const emptyDashboard: CustomerDashboardResponse = {
  profile: {
    uid: 'BDU-2026-RHLSEN-4821',
    fullName: 'Rahul Sen',
    role: 'customer',
    email: 'rahul@example.com',
    phone: '9876543210',
    city: 'Kolkata',
  },
  subscription: null,
  trc: { available: 0, locked: 0, history: [] },
  discountCredits: { availableUnits: [], history: [] },
  drawEntries: [],
  winnerBenefits: [],
  bookings: [],
  payments: [],
  supportTickets: [],
};

describe('ModernDashboardApp', () => {
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

  it('renders the server UID and an empty bookings state', async () => {
    await act(async () => {
      root.render(
        <ModernDashboardApp
          model={emptyDashboard}
          onLogout={vi.fn()}
          onBookPaidTour={vi.fn()}
        />,
      );
    });

    expect(container.textContent).toContain('BDU-2026-RHLSEN-4821');
    expect(container.textContent).not.toContain('Demo Rahul');

    const bookingsButton = [...container.querySelectorAll('button')]
      .find((button) => button.textContent?.includes('My Bookings'));
    expect(bookingsButton).toBeDefined();

    await act(async () => {
      bookingsButton?.click();
    });

    expect(container.textContent).toContain('No bookings yet');
  });
});

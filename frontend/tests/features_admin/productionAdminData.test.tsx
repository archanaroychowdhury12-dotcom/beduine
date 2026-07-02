import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useAdminUsers } from '@/features/admin/hooks/useAdminUsers';
import { getMockAuthAdmin } from '@/features/admin/hooks/adminAuthAdapter';
import type { AppUser } from '@/types';

vi.mock('@/features/admin/hooks/adminAuthAdapter', () => ({
  getMockAuthAdmin: vi.fn(),
}));

const admin = {
  id: 'admin-1',
  role: 'admin',
  email: 'admin@example.com',
  fullName: 'Admin',
} as AppUser;

describe('production admin data', () => {
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
    vi.clearAllMocks();
  });

  it('loads admin users from the API without reading mock auth', async () => {
    const api = {
      listAdminUsers: vi.fn().mockResolvedValue([{
        id: 'user-1',
        email: 'customer@example.com',
        user_metadata: { role: 'customer', uid: 'BDU-2026-ABC123-1234' },
      }]),
    };
    function Probe() {
      const state = useAdminUsers(admin, api as never, 'production');
      return <span>{state.adminUsers[0]?.email || 'loading'}</span>;
    }

    await act(async () => {
      root.render(<Probe />);
    });

    expect(api.listAdminUsers).toHaveBeenCalled();
    expect(getMockAuthAdmin).not.toHaveBeenCalled();
    expect(container.textContent).toContain('customer@example.com');
  });
});

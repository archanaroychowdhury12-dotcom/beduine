import { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import PublicWinnersPage from '@/pages/PublicWinnersPage';

describe('PublicWinnersPage', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    vi.useFakeTimers();
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
    vi.useRealTimers();
  });

  it('shows a loading state before the empty published-results state', async () => {
    await act(async () => {
      root.render(<PublicWinnersPage />);
    });

    expect(container.textContent).toContain('Loading published winner results...');

    await act(async () => {
      vi.advanceTimersByTime(601);
    });

    expect(container.textContent).toContain('No published winners yet');
    expect(container.textContent).toContain(
      'Public winner announcements have not been connected for this production route yet.',
    );
  });
});

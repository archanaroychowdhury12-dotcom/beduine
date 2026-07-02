import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SupportTickets } from '@/features/dashboard/modern/pages/SupportTickets';

function setNativeValue(element: HTMLInputElement | HTMLTextAreaElement, value: string) {
  const prototype = element instanceof HTMLInputElement
    ? HTMLInputElement.prototype
    : HTMLTextAreaElement.prototype;
  Object.getOwnPropertyDescriptor(prototype, 'value')?.set?.call(element, value);
  element.dispatchEvent(new Event('input', { bubbles: true }));
}

describe('SupportTickets', () => {
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

  it('creates a support ticket through the backend', async () => {
    const createTicket = vi.fn().mockResolvedValue({
      id: 'SUP-000001',
      subject: 'Payment not updated',
      status: 'open',
      createdAt: '2026-07-02T10:00:00.000Z',
    });

    await act(async () => {
      root.render(<SupportTickets tickets={[]} createTicket={createTicket} />);
    });
    const newButton = [...container.querySelectorAll('button')]
      .find((button) => button.textContent?.includes('New Ticket'));
    await act(async () => newButton?.click());

    const subject = container.querySelector('input') as HTMLInputElement;
    const message = container.querySelector('textarea') as HTMLTextAreaElement;
    await act(async () => {
      setNativeValue(subject, 'Payment not updated');
      setNativeValue(message, 'My captured payment is still pending.');
    });

    const submit = [...container.querySelectorAll('button')]
      .find((button) => button.textContent?.includes('Create Ticket'));
    await act(async () => submit?.click());

    expect(createTicket).toHaveBeenCalledWith(expect.objectContaining({
      subject: 'Payment not updated',
      message: 'My captured payment is still pending.',
    }));
    expect(container.textContent).toContain('SUP-000001');
  });
});

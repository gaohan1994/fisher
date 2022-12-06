/**
 * @vitest-environment jsdom
 */
import { describe, expect, test, vi } from 'vitest';
import { FisherTimer } from '../fisher-timer';

describe('FisherTimer', () => {
  test('action should called in timer', () => {
    vi.useFakeTimers();
    const action = vi.fn();
    const fisherTimer = new FisherTimer({
      id: 'Test',
      action,
      fireImmediately: false,
    });
    expect(fisherTimer.id).toBe('FisherTimer:Test');
    fisherTimer.startTimer(50);
    vi.advanceTimersByTime(150);
    expect(action).toBeCalledTimes(3);
    vi.clearAllTimers();
  });

  test('action should called in timer immediately', () => {
    vi.useFakeTimers();
    const action = vi.fn();
    const fisherTimer = new FisherTimer({ action, fireImmediately: true });
    fisherTimer.startTimer(50);
    expect(action).toBeCalled();
    vi.clearAllTimers();
  });

  test('timer fireImmediately called', () => {
    vi.useFakeTimers();
    const action = vi.fn();
    const fisherTimer = new FisherTimer({ action, fireImmediately: true });
    fisherTimer.startTimer(50);
    vi.advanceTimersByTime(150);
    expect(action).toBeCalledTimes(4);
    vi.clearAllTimers();
  });
});

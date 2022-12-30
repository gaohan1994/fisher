/**
 * @vitest-environment jsdom
 */
import { describe, expect, test, vi } from 'vitest';
import { FisherTimer } from '../fisher-timer';

describe('FisherTimer', () => {
  test('action should called in timer', () => {
    vi.useFakeTimers();
    const action = vi.fn();
    const fisherTimer = new FisherTimer('Test', action);
    expect(fisherTimer.id).toBe('FisherTimer:Test');
    fisherTimer.startTimer(50);
    vi.advanceTimersByTime(150);
    expect(action).toBeCalledTimes(3);
    vi.clearAllTimers();
  });

  test('should success run action once', () => {
    vi.useFakeTimers();
    const action = vi.fn();
    const fisherTimer = new FisherTimer('Test', action, { once: true });
    fisherTimer.startTimer(50);
    vi.advanceTimersByTime(150);
    expect(action).toBeCalledTimes(1);
    vi.clearAllTimers();
  });
});

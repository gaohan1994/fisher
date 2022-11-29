/**
 * @vitest-environment jsdom
 */

import { describe, expect, test, vi } from 'vitest';
import { FisherTimer } from '../fisher-timer';
describe('FisherTimer', () => {
  test('action should called in timer', () => {
    vi.useFakeTimers();
    const action = vi.fn();
    const fisherTimer = new FisherTimer({ action });
    fisherTimer.startTimer(50);
    vi.advanceTimersByTime(150);
    expect(action).toBeCalledTimes(3);
    vi.clearAllTimers();
  });
});

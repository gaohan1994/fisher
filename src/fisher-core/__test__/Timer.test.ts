/**
 * @vitest-environment jsdom
 */
import { describe, expect, test, vi } from 'vitest';
import { Timer } from '../fisher-timer';

describe('Timer', () => {
  test('action should called in timer', () => {
    vi.useFakeTimers();

    const action = vi.fn();
    const timer = new Timer('Test', action);

    timer.startTimer(50);
    vi.advanceTimersByTime(150);

    expect(timer.id).toBe('Timer:Test');
    expect(action).toBeCalledTimes(3);

    vi.clearAllTimers();
  });

  test('should success stop timer when called stopTimer', () => {
    vi.useFakeTimers();

    const action = vi.fn();
    const timer = new Timer('Test', action);

    timer.startTimer(50);
    vi.advanceTimersByTime(150);

    timer.stopTimer();
    vi.advanceTimersByTime(150);

    expect(action).toBeCalledTimes(3);
    vi.clearAllTimers();
  });

  test('should run once immediately if set fireImmediately', () => {
    vi.useFakeTimers();

    const action = vi.fn();
    const timer = new Timer('Test', action, { fireImmediately: true });

    timer.startTimer(50);
    vi.advanceTimersByTime(150);

    expect(action).toBeCalledTimes(4);
    vi.clearAllTimers();
  });

  test('should success run progess timer', () => {
    vi.useFakeTimers();

    const action = vi.fn();
    const timer = new Timer('Test', action, { showProgress: true });

    expect(timer.progress).toBe(0);
    timer.startTimer(1000);

    vi.advanceTimersByTime(100);
    expect(timer.progress).toBe(10);

    vi.advanceTimersByTime(100);
    expect(timer.progress).toBe(20);

    vi.advanceTimersByTime(800);
    expect(timer.progress).toBe(0);
    expect(action).toBeCalled();

    vi.clearAllTimers();
  });

  test('should success reset progress', () => {
    vi.useFakeTimers();

    const action = vi.fn();
    const timer = new Timer('Test', action, { showProgress: true });

    expect(timer.progress).toBe(0);
    timer.startTimer(1000);

    vi.advanceTimersByTime(100);
    expect(timer.progress).toBe(10);

    timer.resetProgress();
    expect(timer.progress).toEqual(0);

    vi.advanceTimersByTime(100);
    expect(timer.progress).toBe(10);

    vi.clearAllTimers();
  });
});

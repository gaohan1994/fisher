/**
 * @vitest-environment jsdom
 */
import { describe, expect, test } from 'vitest';
import {
  FisherCore,
  FisherBackpack,
  FisherGold,
  fisherLaunch,
} from '@FisherCore';

describe('FisherCore', () => {
  test('should initialize FisherCore', () => {
    const fisherCore = new FisherCore();
    expect(fisherCore.fisherBackpack instanceof FisherBackpack).toBeTruthy();
    expect(fisherCore.fisherGold instanceof FisherGold).toBeTruthy();
  });

  test('should inject fisher to window object', () => {
    fisherLaunch();
    expect(window.fisher instanceof FisherCore).toBeTruthy();
  });
});

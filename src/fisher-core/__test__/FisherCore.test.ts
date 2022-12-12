import { describe, expect, test } from 'vitest';
import { FisherCore, FisherBackpack, FisherGold } from '@FisherCore';

describe('FisherCore', () => {
  test('should initialize FisherCore', () => {
    const fisherCore = new FisherCore();
    expect(fisherCore.fisherBackpack instanceof FisherBackpack).toBeTruthy();
    expect(fisherCore.fisherGold instanceof FisherGold).toBeTruthy();
  });
});

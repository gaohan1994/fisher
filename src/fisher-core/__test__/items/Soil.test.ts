// @vitest-environment happy-dom

import { beforeEach, describe, expect, test, vi } from 'vitest';
import { FisherCore } from '../../fisher-core';
import { Seed, Soil } from '../../fisher-item';
import { Backpack } from '../../fisher-backpack';

const testSeed = {
  id: 'Test:Seed',
  name: '测试种子',
  desc: '测试种子',
  media: '',
  gatherInterval: 5000,
  rewardItemId: 'NormalReiki',
  rewardItemQuantity: 10,
};
const seed = new Seed(testSeed);
let core: FisherCore;
let backpack: Backpack;

beforeEach(() => {
  core = FisherCore.create();
  backpack = core.backpack;
  backpack.items.clear();
  backpack.addItem(seed, 1);
});

describe('Soil', () => {
  test('Should success watering and spread manure', () => {
    const soil = new Soil();

    expect(soil.dry).toEqual(50);
    expect(soil.fertility).toEqual(50);
    expect(soil.capacity).toEqual(1);

    soil.watering();
    soil.spreadManure();

    expect(soil.dry).toEqual(60);
    expect(soil.fertility).toEqual(60);
    expect(soil.capacity).toEqual(1.2);
  });

  test('Should success seeding', () => {
    const soil = new Soil();
    expect(soil.seedHandler).toBeUndefined();
    expect(soil.seeded).toBeFalsy();
    expect(backpack.checkItem(seed, 1)).toBeTruthy();

    soil.seeding(seed);
    expect(backpack.checkItem(seed)).toBeFalsy();
    expect(soil.seeded).toBeTruthy();
    expect(() => soil.gathering()).toThrow('The gather time has not yet ready');

    vi.useFakeTimers();
    vi.advanceTimersByTime(5000);
    expect(backpack.checkItemById('NormalReiki')).toBeFalsy();
    soil.gathering();
    expect(backpack.checkItemById('NormalReiki')).toBeTruthy();
    expect(soil.dry).toBeLessThan(30);
    expect(soil.fertility).toBeLessThan(30);
    expect(soil.seedHandler).toBeUndefined();
    expect(soil.seeded).toBeFalsy();

    vi.clearAllTimers();
  });
});

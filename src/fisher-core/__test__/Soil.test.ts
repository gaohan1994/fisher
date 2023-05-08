import { beforeEach, describe, expect, test, vi } from 'vitest';
import { FisherCore } from '../fisher-core';
import { Seed, SeedHandler, Soil } from '../fisher-item';
import { Backpack } from '../fisher-backpack';
import { SoilHandler } from '../fisher-plant/SoilHandler';

const testSoil = { id: 'Plant:Soil:1', name: '土地', price: 100, unlockLevel: 1, desc: '', media: '' };
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
    const soil = new Soil(testSoil);
    const soilHander = new SoilHandler();

    expect(soil.dry).toEqual(50);
    expect(soil.fertility).toEqual(50);
    expect(soil.capacity).toEqual(1);

    soilHander.watering(soil);
    soilHander.spreadManure(soil);

    expect(soil.dry).toEqual(60);
    expect(soil.fertility).toEqual(60);
    expect(soil.capacity).toEqual(1.2);
  });

  test('Should success seeding', () => {
    const soil = new Soil(testSoil);
    const soilHander = new SoilHandler();

    expect(soil.seedHandler).toBeUndefined();
    expect(soil.seeded).toBeFalsy();
    expect(backpack.checkItem(seed)).toBeTruthy();

    soilHander.seeding(seed, soil);
    expect(backpack.checkItem(seed)).toBeFalsy();
    expect(soil.seedHandler instanceof SeedHandler).toBeTruthy();
    expect(soil.seeded).toBeTruthy();
    expect(() => soilHander.gathering(soil)).toThrow('The gather time has not yet ready');

    vi.useFakeTimers();
    vi.advanceTimersByTime(5000);
    expect(backpack.checkItemById('NormalReiki')).toBeFalsy();
    soilHander.gathering(soil);

    expect(backpack.checkItemById('NormalReiki')).toBeTruthy();
    expect(soil.dry).toBeLessThan(30);
    expect(soil.fertility).toBeLessThan(30);
    expect(soil.seedHandler).toBeUndefined();
    expect(soil.seeded).toBeFalsy();

    vi.clearAllTimers();
  });
});

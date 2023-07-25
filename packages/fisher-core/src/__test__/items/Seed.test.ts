import dayjs from 'dayjs';
import { describe, expect, test, vi } from 'vitest';
import { Seed, SeedHandler } from '../../fisher-item';

const testSeed = {
  id: 'Test:Seed',
  name: '测试种子',
  desc: '测试种子',
  media: '',
  gatherInterval: 5000,
  rewardItemId: 'Test:Seed:Id',
  rewardItemQuantity: 10,
};

describe('SeedHandler', () => {
  test('Should success seeding', () => {
    const seed = new Seed(testSeed);

    const unit = dayjs().valueOf();
    const seedHandler = SeedHandler.seeding(seed);

    expect(seedHandler.seed).toStrictEqual(seed);
    expect(seedHandler.seedingTime).toEqual(unit);
    expect(seedHandler.gatherTime).toEqual(dayjs(unit).add(seed.gatherInterval).valueOf());

    vi.useFakeTimers();
    expect(seedHandler.checkGatherAvailable()).toBeFalsy();
    vi.advanceTimersByTime(5000);
    expect(seedHandler.checkGatherAvailable()).toBeTruthy();

    vi.clearAllTimers();
  });
});

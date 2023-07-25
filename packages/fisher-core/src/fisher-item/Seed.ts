import dayjs from 'dayjs';
import { IItem, Item, ItemType } from './Item';

interface ISeed extends IItem {
  gatherInterval: number;
  rewardItemId: string;
  rewardItemQuantity: number;
}
class Seed extends Item {
  public type = ItemType.Seed;

  public gatherInterval: number;

  public rewardItemId: string;

  public rewardItemQuantity: number;

  constructor(options: ISeed) {
    super(options);
    this.gatherInterval = options.gatherInterval;
    this.rewardItemId = options.rewardItemId;
    this.rewardItemQuantity = options.rewardItemQuantity;
  }
}

interface ISeedHandler {
  seedingTime: number | undefined;
  gatherTime: number | undefined;
}

class SeedHandler implements ISeedHandler {
  public seed: Seed;

  public seedingTime: number | undefined = undefined;

  public gatherTime: number | undefined = undefined;

  private constructor(seed: Seed) {
    this.seed = seed;
  }

  public static seeding(seed: Seed): SeedHandler {
    const seedRecord = new SeedHandler(seed);
    seedRecord.seedingTime = dayjs().valueOf();
    seedRecord.gatherTime = dayjs(seedRecord.seedingTime).add(seed.gatherInterval).valueOf();
    return seedRecord;
  }

  public static load(seed: Seed, options: ISeedHandler): SeedHandler {
    const seedRecord = new SeedHandler(seed);
    seedRecord.seedingTime = options.seedingTime;
    seedRecord.gatherTime = options.gatherTime;
    return seedRecord;
  }

  public checkGatherAvailable = () => {
    return dayjs().isAfter(dayjs(this.gatherTime));
  };
}

export { Seed, SeedHandler };

import { makeAutoObservable } from 'mobx';
import { prefixLogger, prefixes } from '@fisher/logger';
import { random } from '../utils';
import { Seed, SeedHandler } from './Seed';
import { EventKeys, events } from '@shared';
import { Reward } from '../fisher-reward';

const BaseWateringIncreaseValue = 10;
const BaseSpreadManureIncreaseValue = 10;
const GatherEffectValue = 20;
const getSideEffectValue = () => GatherEffectValue + random(1, 10);

class Soil {
  static readonly logger = prefixLogger(prefixes.FISHER_CORE, 'Soil');

  public seedHandler: SeedHandler | undefined = undefined;

  public get seed() {
    return this.seedHandler?.seed;
  }

  public get seeded() {
    return this.seedHandler !== undefined;
  }

  public fertility: number = 50;

  public dry: number = 50;

  public get capacity() {
    return (this.fertility + this.dry) / 100;
  }

  constructor() {
    makeAutoObservable(this);
  }

  public seeding = (seed: Seed) => {
    if (this.seeded) {
      throw new Error(`Try seeding ${seed.id} in a seeded soil`);
    }

    this.seedHandler = SeedHandler.seeding(seed);
    events.emit(EventKeys.Backpack.ReduceItem, seed, 1);
    Soil.logger.info(`Success seeding ${seed.id}`);
  };

  public watering = () => {
    if (this.dry >= 100) return;
    this.dry = Math.min(100, this.dry + BaseWateringIncreaseValue);
  };

  public spreadManure = () => {
    if (this.fertility >= 100) return;
    this.fertility = Math.min(100, this.fertility + BaseSpreadManureIncreaseValue);
  };

  public gathering = () => {
    if (!this.seeded) {
      throw new Error('Try gather in a seeded soil');
    }

    if (!this.seedHandler!.checkGatherAvailable()) {
      throw new Error('The gather time has not yet ready');
    }

    const reward = this.createGatherReward();
    reward.execute();
    Soil.logger.info(`Success gather soil, seed: ${this.seed!.id}`);

    this.gatherEffects();
    Soil.logger.info(`After gathering effects fertility: ${this.fertility}, dry: ${this.dry}`);

    this.clearSoil();
  };

  private createGatherReward = () => {
    const quantity = this.seed!.rewardItemQuantity * this.capacity;
    return Reward.create({ itemId: this.seed!.rewardItemId, itemQuantity: quantity });
  };

  private gatherEffects = () => {
    this.dry = Math.max(0, this.dry - getSideEffectValue());
    this.fertility = Math.max(0, this.fertility - getSideEffectValue());
  };

  private clearSoil = () => {
    this.seedHandler = undefined;
  };
}

export { Soil };

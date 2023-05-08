import { makeAutoObservable } from 'mobx';
import { prefixLogger, prefixes } from '@FisherLogger';
import { random } from '../utils';
import { EventKeys, events } from '../fisher-events';
import { Soil, Seed, SeedHandler } from '../fisher-item';
import { Reward } from '../fisher-reward';

const BaseWateringIncreaseValue = 10;
const BaseSpreadManureIncreaseValue = 10;
const GatherEffectValue = 20;
const getSideEffectValue = () => GatherEffectValue + random(1, 10);

class SoilHandler {
  static readonly logger = prefixLogger(prefixes.FISHER_CORE, 'SoilHandler');

  constructor() {
    makeAutoObservable(this);
  }

  public seeding = (seed: Seed, soil: Soil) => {
    if (soil.seeded) {
      throw new Error(`Try seeding ${seed.id} in a seeded soil`);
    }

    soil.seedHandler = SeedHandler.seeding(seed);
    events.emit(EventKeys.Backpack.ReduceItem, seed, 1);
    SoilHandler.logger.info(`Success seeding ${seed.id}`);
  };

  public watering = (soil: Soil) => {
    if (soil.dry >= 100) return;
    soil.setDry(Math.min(100, soil.dry + BaseWateringIncreaseValue));
  };

  public spreadManure = (soil: Soil) => {
    if (soil.fertility >= 100) return;
    soil.setFertility(Math.min(100, soil.fertility + BaseSpreadManureIncreaseValue));
  };

  public gathering = (soil: Soil) => {
    if (!soil.seeded) {
      throw new Error('Try gather in a seeded soil');
    }

    if (!soil.seedHandler!.checkGatherAvailable()) {
      throw new Error('The gather time has not yet ready');
    }

    const reward = this.createGatherReward(soil);
    reward.execute();
    SoilHandler.logger.info(`Success gather soil, seed: ${soil.seed!.id}`);

    this.gatherEffects(soil);
    SoilHandler.logger.info(`After gathering effects fertility: ${soil.fertility}, dry: ${soil.dry}`);

    this.clearSoil(soil);
  };

  private createGatherReward = (soil: Soil) => {
    const quantity = soil.seed!.rewardItemQuantity * soil.capacity;
    return Reward.create({ itemId: soil.seed!.rewardItemId, itemQuantity: quantity });
  };

  private gatherEffects = (soil: Soil) => {
    soil.setDry(Math.max(0, soil.dry - getSideEffectValue()));
    soil.setFertility(Math.max(0, soil.fertility - getSideEffectValue()));
  };

  private clearSoil = (soil: Soil) => {
    soil.seedHandler = undefined;
  };
}

export { SoilHandler };

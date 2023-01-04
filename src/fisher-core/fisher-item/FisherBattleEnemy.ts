import { FisherItem, ItemType, IFisherItem } from './FisherItem';
import { PersonLevel } from './PersonLevelItem';

export interface IFisherBattleEnemyItem extends IFisherItem {
  unlockLevel?: PersonLevel;
  level: PersonLevel;
  goldReward?: number;
  itemRewards?: EnemyItemReward[];
  probabilityRewards?: EnemyProbabilityReward[];
}

export interface EnemyItemReward {
  itemId: string;
  itemQuantity?: number;
}

export interface EnemyProbabilityReward {
  gold?: number;
  itemId: string;
  probability: number;
  itemQuantity?: number;
}

export class FisherBattleEnemyItem extends FisherItem {
  type = ItemType.BattleEnemy;

  public unlockLevel = 'GasRefiningEarly' as PersonLevel;

  public level: PersonLevel;

  public goldReward = 0;

  public itemRewards: EnemyItemReward[] = [];

  public probabilityRewards: EnemyProbabilityReward[] = [];

  constructor(options: IFisherBattleEnemyItem) {
    super(options);

    this.level = options.level;

    if (options.unlockLevel) this.unlockLevel = options.unlockLevel;

    if (options.goldReward) this.goldReward = options.goldReward;

    if (options.itemRewards) this.itemRewards = options.itemRewards;

    if (options.probabilityRewards)
      this.probabilityRewards = options.probabilityRewards;
  }
}

export interface IFisherBattleAreaItem extends IFisherItem {
  unlockLevel: PersonLevel;
  enemies?: FisherBattleEnemyItem[];
}

export class FisherBattleAreaItem extends FisherItem {
  type = ItemType.BattleArea;

  public unlockLevel: PersonLevel;

  public enemies: FisherBattleEnemyItem[] = [];

  constructor(options: IFisherBattleAreaItem) {
    super(options);
    this.unlockLevel = options.unlockLevel;
    if (options.enemies) this.enemies = options.enemies;
  }

  public setEnemies = (value: FisherBattleEnemyItem[]) => {
    this.enemies = value;
  };
}

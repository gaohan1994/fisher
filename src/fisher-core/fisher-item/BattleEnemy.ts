import { Item, ItemType, IItem } from './Item';
import { PersonLevel } from './PersonLevelItem';

export interface IBattleEnemyItem extends IItem {
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

export class BattleEnemyItem extends Item {
  type = ItemType.BattleEnemy;

  public unlockLevel = 'GasRefiningEarly' as PersonLevel;

  public level: PersonLevel;

  public goldReward = 0;

  public itemRewards: EnemyItemReward[] = [];

  public probabilityRewards: EnemyProbabilityReward[] = [];

  constructor(options: IBattleEnemyItem) {
    super(options);

    this.level = options.level;

    if (options.unlockLevel) this.unlockLevel = options.unlockLevel;

    if (options.goldReward) this.goldReward = options.goldReward;

    if (options.itemRewards) this.itemRewards = options.itemRewards;

    if (options.probabilityRewards)
      this.probabilityRewards = options.probabilityRewards;
  }
}

export interface IBattleAreaItem extends IItem {
  unlockLevel: PersonLevel;
  enemies?: BattleEnemyItem[];
}

export class BattleAreaItem extends Item {
  type = ItemType.BattleArea;

  public unlockLevel: PersonLevel;

  public enemies: BattleEnemyItem[] = [];

  constructor(options: IBattleAreaItem) {
    super(options);
    this.unlockLevel = options.unlockLevel;
    if (options.enemies) this.enemies = options.enemies;
  }

  public setEnemies = (value: BattleEnemyItem[]) => {
    this.enemies = value;
  };
}

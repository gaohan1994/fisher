import { IItem, Item, ItemType } from './Item';
import { PersonLevel } from './PersonLevelItem';

export interface IEnemyItem extends IItem {
  level: PersonLevel;
  unlockLevel?: PersonLevel;
  goldReward?: number;
  itemRewards?: EnemyItemReward[];
  randomRewards?: EnemyRandomReward[];
}

export interface EnemyItemReward {
  itemId: string;
  itemQuantity?: number;
}

export interface EnemyRandomReward {
  gold?: number;
  itemId: string;
  probability: number;
  itemQuantity?: number;
}

export class EnemyItem extends Item {
  public level: PersonLevel;

  public type = ItemType.Enemy;

  public unlockLevel = 'GasRefiningEarly' as PersonLevel;

  public goldReward = 0;

  public itemRewards: EnemyItemReward[] = [];

  public randomRewards: EnemyRandomReward[] = [];

  constructor(options: IEnemyItem) {
    super(options);
    this.level = options.level;
    if (options.unlockLevel) this.unlockLevel = options.unlockLevel;
    if (options.goldReward) this.goldReward = options.goldReward;
    if (options.itemRewards) this.itemRewards = options.itemRewards;
    if (options.randomRewards) this.randomRewards = options.randomRewards;
  }
}

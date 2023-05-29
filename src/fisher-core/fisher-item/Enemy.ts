// import { PersonMode } from '../fisher-person';
import { IItem, Item, ItemType } from './Item';

export interface IEnemyItem extends IItem {
  level: number;
  unlockLevel?: number;
  goldReward?: number;
  itemRewards?: EnemyItemReward[];
  randomRewards?: EnemyRandomReward[];
  mode?: string;
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
  public level: number;

  public type = ItemType.Enemy;

  public mode = 'CommonEnemy';

  public unlockLevel = 0;

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
    if (options.mode) this.mode = options.mode;
  }
}

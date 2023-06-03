import { ActionId } from '../fisher-actions';
import { IItem, Item, ItemType } from './Item';

export interface IEnemyItem extends IItem {
  level: number;
  actionIds?: string[];
  unlockLevel?: number;
  goldReward?: number;
  itemRewards?: EnemyItemReward[];
  randomRewards?: EnemyRandomReward[];
  experienceRewards?: number;
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

  public actionIds: ActionId[] = [];

  public experienceRewards = 0;

  constructor(options: IEnemyItem) {
    super(options);
    this.level = options.level;
    if (options.mode) this.mode = options.mode;
    if (options.unlockLevel) this.unlockLevel = options.unlockLevel;
    if (options.goldReward) this.goldReward = options.goldReward;
    if (options.itemRewards) this.itemRewards = options.itemRewards;
    if (options.randomRewards) this.randomRewards = options.randomRewards;
    if (options.experienceRewards) this.experienceRewards = options.experienceRewards;
    if (options.actionIds) this.actionIds = options.actionIds as ActionId[];
  }
}

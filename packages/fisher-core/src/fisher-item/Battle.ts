import { EnemyItem } from './Enemy.js';
import { Item, ItemType, IItem } from './Item.js';

export interface IBattleAreaItem extends IItem {
  unlockLevel: number;
  enemies?: EnemyItem[];
}

export class BattleAreaItem extends Item {
  type = ItemType.BattleArea;

  public unlockLevel: number;

  public enemies: EnemyItem[] = [];

  constructor(options: IBattleAreaItem) {
    super(options);
    this.unlockLevel = options.unlockLevel;
    if (options.enemies) this.enemies = options.enemies;
  }

  public setEnemies = (value: EnemyItem[]) => {
    this.enemies = value;
  };
}

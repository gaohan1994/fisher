import { EnemyItem, IEnemyItem } from './Enemy.js';
import { Item, ItemType, IItem } from './Item.js';

export interface IBattleAreaItem extends IItem {
  unlockLevel: number;
  enemies: IEnemyItem[];
}

export class BattleAreaItem extends Item {
  type = ItemType.BattleArea;

  public unlockLevel: number;

  public enemies: EnemyItem[];

  constructor(public readonly options: IBattleAreaItem) {
    super(options);
    this.unlockLevel = options.unlockLevel;
    this.enemies = options.enemies.map((enemyOption) => new EnemyItem(enemyOption));
  }

  public setEnemies = (value: EnemyItem[]) => {
    this.enemies = value;
  };
}

import { IItem, Item } from './Item.js';
import { EnemyItem, IEnemyItem } from './Enemy.js';
import { ItemType } from '@shared';

interface IDungeonItem extends IItem {
  unlockLevel: number;
  enemies: Array<IEnemyItem>;
}

class DungeonItem extends Item {
  public type = ItemType.Dungeon;

  public unlockLevel = 0;

  public enemies: EnemyItem[] = [];

  public get enemiesNumber() {
    return this.enemies.length;
  }

  constructor(options: IDungeonItem) {
    super(options);
    this.unlockLevel = options.unlockLevel;
    this.enemies = options.enemies.map((item) => new EnemyItem(item));
  }

  public tryGetProgressExtraRewards = (): any[] | undefined => {
    return undefined;
  };
}

export { DungeonItem };
export type { IDungeonItem };

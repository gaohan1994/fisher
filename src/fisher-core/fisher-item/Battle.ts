import { EnemyItem } from './Enemy';
import { Item, ItemType, IItem } from './Item';
import { PersonLevel } from './PersonLevelItem';

export interface IBattleAreaItem extends IItem {
  unlockLevel: PersonLevel;
  enemies?: EnemyItem[];
}

export class BattleAreaItem extends Item {
  type = ItemType.BattleArea;

  public unlockLevel: PersonLevel;

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

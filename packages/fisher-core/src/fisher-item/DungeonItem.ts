import { IItem, Item, ItemType } from './Item';
import { EnemyItem, IEnemyItem } from './Enemy';
import { FisherDungeonError } from '@shared';

interface IDungeonItem extends IItem {
  unlockLevel: number;
  enemies: Array<IEnemyItem>;
  progressExtraReward?: {
    [key: string | number]: Array<ICreateRewardOptions>;
  };
}

interface ICreateRewardOptions {
  gold?: number;
  itemId?: string;
  itemQuantity?: number;
  componentId?: string;
  experience?: number;
}

class DungeonItem extends Item {
  public type = ItemType.Dungeon;

  public unlockLevel = 0;

  public enemies: Array<EnemyItem> = [];

  public progress = 0;

  public progressExtraRewardMap = new Map<number, ICreateRewardOptions[]>();

  public get currentEnemyItem() {
    return this.enemies[this.progress];
  }

  public get enemiesNumber() {
    return this.enemies.length;
  }

  private get hasNextEnemies() {
    return this.progress < this.enemiesNumber - 1;
  }

  constructor(options: IDungeonItem) {
    super(options);

    this.unlockLevel = options.unlockLevel;

    this.enemies = options.enemies.map((item) => new EnemyItem(item));
    if (options.progressExtraReward !== undefined) {
      Object.keys(options.progressExtraReward).map((enemyIndex) => {
        if (options.progressExtraReward?.[enemyIndex]) {
          this.progressExtraRewardMap.set(Number(enemyIndex), options.progressExtraReward[enemyIndex]);
        }
      });
    }
  }

  public setProgress = (value: number) => {
    this.progress = value;
  };

  public nextEnemy = (): EnemyItem => {
    if (!this.hasNextEnemies) {
      this.progress = 0;
    } else {
      this.progress += 1;
    }
    return this.enemies[this.progress];
  };

  public tryGetProgressExtraRewards = (enemyId: string): ICreateRewardOptions[] | undefined => {
    const enemyIndex = this.getEnemyDungeonIndex(enemyId);

    if (enemyIndex < 0) {
      throw new FisherDungeonError(`Can not find enemy item ${enemyId} in Dungeon ${this.id}`);
    }

    const progressExtraRewards = this.progressExtraRewardMap.get(enemyIndex);
    if (progressExtraRewards === undefined) {
      return undefined;
    }

    return progressExtraRewards;
  };

  private getEnemyDungeonIndex = (enemyId: string) => {
    return this.enemies.findIndex((enemy) => enemy.id === enemyId);
  };
}

export { DungeonItem };
export type { IDungeonItem };

import { action, computed, makeObservable, observable } from 'mobx';
import { IItem, Item, ItemType } from './Item';
import { EnemyItem, IEnemyItem } from './Enemy';
import { FisherDungeonError } from '../fisher-error';
import { ICreateRewardOptions, Reward } from '../fisher-reward';
import { Enemy } from '../fisher-person';

interface IDungeonItem extends IItem {
  enemies: Array<IEnemyItem>;
  progressExtraReward?: {
    [key: string]: Array<ICreateRewardOptions>;
  };
}

class DungeonItem extends Item {
  public type = ItemType.Dungeon;

  @observable
  public enemies: Array<EnemyItem>;

  @observable
  public progress = 0;

  @observable
  public progressExtraRewardMap = new Map<number, Reward[]>();

  @computed
  public get currentEnemyItem() {
    return this.enemies[this.progress];
  }

  @computed
  public get enemiesNumber() {
    return this.enemies.length;
  }

  @computed
  private get hasNextEnemies() {
    return this.progress < this.enemiesNumber - 1;
  }

  constructor(options: IDungeonItem) {
    super(options);
    makeObservable(this);

    this.enemies = options.enemies.map((item) => new EnemyItem(item));
    if (options.progressExtraReward) {
      for (let enemyIndex in options.progressExtraReward) {
        this.progressExtraRewardMap.set(Number(enemyIndex), options.progressExtraReward[enemyIndex].map(Reward.create));
      }
    }
  }

  @action
  public nextEnemy = (): EnemyItem => {
    if (!this.hasNextEnemies) {
      this.progress = 0;
    } else {
      this.progress += 1;
    }
    return this.enemies[this.progress];
  };

  @action
  public tryGetProgressExtraReward = (enemy: Enemy): Reward[] | undefined => {
    const enemyIndex = this.getEnemyDungeonIndex(enemy.id);

    if (enemyIndex < 0) {
      throw new FisherDungeonError(`Can not find enemy item ${enemy.id} in Dungeon ${this.id}`);
    }

    return this.progressExtraRewardMap.get(enemyIndex);
  };

  @action
  private getEnemyDungeonIndex = (enemyId: string) => {
    return this.enemies.findIndex((enemy) => enemy.id === enemyId);
  };
}

export { DungeonItem };

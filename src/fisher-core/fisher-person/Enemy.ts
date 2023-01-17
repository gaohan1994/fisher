import { action, computed, observable } from 'mobx';
import { EnemyItemReward, EnemyRandomReward, EnemyItem } from '../fisher-item';
import { Reward } from '../fisher-reward';
import { Person } from './Person';

export class Enemy extends Person {
  @observable
  public id: string = '';

  public mode = Person.Mode.Enemy;

  @observable
  public goldReward = 0;

  @computed
  public get hasGoldReward() {
    return typeof this.goldReward === 'number' && this.goldReward >= 0;
  }

  @observable
  public itemRewards: EnemyItemReward[] = [];

  @computed
  public get hasItemRewards() {
    return this.itemRewards && this.itemRewards.length > 0;
  }

  @observable
  public randomRewards: EnemyRandomReward[] = [];

  @computed
  public get hasRandomRewards() {
    return this.randomRewards && this.randomRewards.length > 0;
  }

  constructor(id: string) {
    super();
    this.id = id;
  }

  @action
  public initialize = async (enemyInfo: EnemyItem) => {
    const { name, goldReward, itemRewards, randomRewards } = enemyInfo;

    this.name = name;

    if (goldReward) this.goldReward = goldReward;
    if (itemRewards) this.itemRewards = itemRewards;
    if (randomRewards) this.randomRewards = randomRewards;

    this.initialized = true;

    Person.logger.debug(`Success initialize Enemy ${this.name}`);
  };

  /**
   * 生成金钱奖励
   * 生成物品奖励
   * 生成随机金钱 / 物品奖励
   *
   * @memberof Enemy
   */
  @action
  public provideRewards = (): Reward[] => {
    const result: Reward[] = [];
    if (this.hasGoldReward) {
      result.push(this.createGoldReward());
    }

    if (this.hasItemRewards) {
      result.push(...this.createItemRewards());
    }

    if (this.hasRandomRewards) {
      result.push(...this.createRandomRewards());
    }

    Person.logger.debug(`Provide Enemy:${this.id} rewards`);
    return result;
  };

  @action
  private createGoldReward = () => {
    return Reward.create({ gold: this.goldReward });
  };

  @action
  private createRandomRewards = () => {
    return this.randomRewards
      .map(({ probability, gold, itemId, itemQuantity }) => {
        return Reward.createRandomReward(probability, {
          gold,
          itemId,
          itemQuantity,
        });
      })
      .filter(Boolean) as Reward[];
  };

  @action
  private createItemRewards = () => {
    return this.itemRewards.map((itemReward) => {
      return Reward.create(itemReward);
    });
  };
}

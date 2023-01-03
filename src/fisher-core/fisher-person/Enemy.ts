import { action, computed, observable, override } from 'mobx';
import {
  createReward,
  FisherReward,
  provideProbabilityReward,
} from '../fisher-reward';
import {
  EnemyItemReward,
  EnemyProbabilityReward,
  FisherBattleEnemyItem,
} from '../fisher-item';
import { FisherPerson } from './FisherPerson';

export class Enemy extends FisherPerson {
  @observable
  public id: string = '';

  public mode = FisherPerson.Mode.Enemy;

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
  public probabilityRewards: EnemyProbabilityReward[] = [];

  @computed
  public get hasProbabilityRewards() {
    return this.probabilityRewards && this.probabilityRewards.length > 0;
  }

  constructor(id: string) {
    super();
    this.id = id;
  }

  @action
  public initialize = async (enemyInfo: FisherBattleEnemyItem) => {
    const { name, level, goldReward, itemRewards, probabilityRewards } =
      enemyInfo;

    this.name = name;

    if (goldReward) this.goldReward = goldReward;
    if (itemRewards) this.itemRewards = itemRewards;
    if (probabilityRewards) this.probabilityRewards = probabilityRewards;

    this.personLevelManager.initialize(level);
    this.actionManager.registerActionMap();

    this.initialized = true;

    FisherPerson.logger.debug(`Success initialize Enemy ${this.name}`);
  };

  /**
   * 生成金钱奖励
   * 生成物品奖励
   * 生成随机金钱 / 物品奖励
   *
   * @memberof Enemy
   */
  @action
  public provideRewards = (): FisherReward[] => {
    const result: FisherReward[] = [];
    if (this.hasGoldReward) {
      result.push(this.createGoldReward());
    }

    if (this.hasItemRewards) {
      result.push(...this.createItemRewards());
    }

    if (this.hasProbabilityRewards) {
      result.push(...this.createProbabilityRewards());
    }

    FisherPerson.logger.debug(`Provide Enemy:${this.id} rewards`);
    return result;
  };

  @action
  private createGoldReward = () => {
    return createReward({ gold: this.goldReward });
  };

  @action
  private createProbabilityRewards = () => {
    return this.probabilityRewards
      .map(provideProbabilityReward)
      .filter(Boolean) as FisherReward[];
  };

  @action
  private createItemRewards = () => {
    return this.itemRewards.map(createReward);
  };
}

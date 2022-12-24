import { action, observable, override } from 'mobx';
import {
  createReward,
  FisherReward,
  provideProbabilityReward,
} from '../fisher-reward';
import { FisherPerson } from './FisherPerson';
import { PersonLevel } from './fisher-person-level';

interface EnemyGoldReward {
  gold: number;
}

interface EnemyItemReward {
  itemId: string;
  itemQuantity?: number;
}

interface EnemyProbabilityReward {
  gold?: number;
  itemId: string;
  probability: number;
  itemQuantity?: number;
}

interface InitializeEnemyPayload {
  name: string;
  level: PersonLevel;
  goldReward?: EnemyGoldReward;
  itemRewards?: EnemyItemReward[];
  probabilityRewards?: EnemyProbabilityReward[];
}

export class Enemy extends FisherPerson {
  public override readonly mode = FisherPerson.Mode.Enemy;

  @observable
  public goldReward?: EnemyGoldReward;

  @observable
  public itemRewards?: EnemyItemReward[];

  @observable
  public probabilityRewards?: EnemyProbabilityReward[];

  /**
   * 初始化敌人信息
   * 初始化敌人奖励
   * 初始化完成
   *
   * @param {InitializeEnemyPayload}
   * @memberof Enemy
   */
  @override
  public initialize({
    name,
    level,
    goldReward,
    itemRewards,
    probabilityRewards,
  }: InitializeEnemyPayload): void {
    this.name = name;
    this.personLevel.initialize({ level });
    this.goldReward = goldReward;
    this.itemRewards = itemRewards;
    this.probabilityRewards = probabilityRewards;
    this.initialized = true;
  }

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
    if (this.goldReward) {
      result.push(createReward({ gold: this.goldReward.gold }));
    }
    if (this.itemRewards && this.itemRewards.length > 0) {
      const _itemRewards = this.itemRewards.map(createReward);
      result.push(..._itemRewards);
    }
    if (this.probabilityRewards && this.probabilityRewards.length > 0) {
      const _probabilityRewards = this.probabilityRewards
        .map(provideProbabilityReward)
        .filter(Boolean) as FisherReward[];
      result.push(..._probabilityRewards);
    }
    return result;
  };
}

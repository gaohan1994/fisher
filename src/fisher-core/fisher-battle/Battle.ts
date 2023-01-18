import { makeAutoObservable, reaction } from 'mobx';
import { prefixes, prefixLogger } from '@FisherLogger';
import { store } from '../fisher-packages';
import { EnemyItem } from '../fisher-item';
import { Enemy, master } from '../fisher-person';
import { Reward } from '../fisher-reward';
import { TimerSpace } from '../fisher-timer';
import { EventKeys, events } from '../fisher-events';
import { BattleStatus } from './BattleStatus';

class Battle {
  private static logger = prefixLogger(prefixes.FISHER_CORE, 'Battle');

  public static instance: Battle;

  public static create(): Battle {
    if (!Battle.instance) {
      Battle.instance = new Battle();
    }
    return Battle.instance;
  }

  public static BaseBattleInterval = 1000;

  public readonly id = 'Battle';

  public battleStatus = new BattleStatus();

  public get isInitial() {
    return this.battleStatus.isInitial;
  }

  public get isEnemyLoading() {
    return this.battleStatus.isEnemyLoading;
  }

  public get isFighting() {
    return this.battleStatus.isFighting;
  }

  public get packages() {
    return store.BattleAreas;
  }

  public master = master;

  public activeEnemyItem?: EnemyItem | undefined = undefined;

  public enemy: Enemy | undefined = undefined;

  public get masterDeathCondition() {
    return this.master.Hp <= 0;
  }

  public get enemyDeathCondition() {
    return this.enemy !== undefined && this.enemy.Hp <= 0;
  }

  /**
   * 击杀数统计
   */
  public battleCountMap = new Map<string, number>();

  public rewardPool: Reward[] = [];

  public get hasReward() {
    return this.rewardPool.length > 0;
  }

  constructor() {
    makeAutoObservable(this);
    reaction<boolean>(() => this.masterDeathCondition, this.onMasterDeath);
    reaction<boolean>(() => this.enemyDeathCondition, this.onEnemyDeath);
  }

  /**
   * 初始化战斗敌人
   * - 设置当前激活的敌人信息为传入的敌人信息
   * - new Enemy
   * - 初始化 enemy
   * - 给玩家和敌人互相设置 target
   *
   * @param {EnemyItem} enemyItem
   * @memberof Battle
   */
  public initializeEnemy = async (enemyItem: EnemyItem) => {
    this.activeEnemyItem = enemyItem;
    this.enemy = new Enemy(this.generateEnemyId(enemyItem.id));
    await this.enemy.initialize(enemyItem);
    this.enemy.setTarget(this.master.person);
    this.master.setTarget(this.enemy.person);
  };

  /**
   * 重新初始化敌人
   *
   * @memberof Battle
   */
  public continueInitializeActiveEnemy = async () => {
    if (this.activeEnemyItem === undefined)
      return Battle.logger.error('Try to continue initialize active Enemy but active enemy was undefined');

    await this.initializeEnemy(this.activeEnemyItem);
  };

  public start = async (enemyItem?: EnemyItem) => {
    const currentEnemy = enemyItem ?? this.activeEnemyItem;
    if (currentEnemy === undefined) {
      Battle.logger.error('Try to start battle without enemy', this);
      throw new Error('Try to start battle without enemy');
    }

    this.battleStatus.enemyLoading();
    await this.initializeEnemy(currentEnemy);
    await TimerSpace.space(Battle.BaseBattleInterval);

    this.battleStatus.fighting();
    this.master.startBattle();
    this.enemy?.startBattle();

    events.emit(EventKeys.Core.SetActiveComponent, this);
  };

  public stop = async () => {
    if (this.enemy === undefined) {
      return Battle.logger.error('Try to stop battle but enemy was undefined');
    }

    if (!this.isFighting) {
      return Battle.logger.error('Try to stop battle but already stoped');
    }

    this.master.stopBattle();
    this.enemy.stopBattle();
    this.battleStatus.initial();
  };

  /**
   * 玩家死亡
   * - 停止战斗
   * - 死亡惩罚
   *
   * @memberof Battle
   */
  public onMasterDeath = async (masterDeathCondition: boolean) => {
    if (masterDeathCondition) {
      await this.stop();
      await this.master.deathPenalty();
    }
  };

  /**
   * 敌人死亡
   * - 停止战斗
   * - 杀敌次数 +1
   * - 奖励池更新奖励
   * - 初始化下一个敌人
   * - 再次进入战斗
   *
   * @memberof Battle
   */
  public onEnemyDeath = async (enemyDeathCondition: boolean) => {
    if (enemyDeathCondition) {
      await this.stop();
      await this.updateBattleCount();
      await this.collectRewardToPool();
      await this.start();
    }
  };

  private updateBattleCount = async () => {
    if (this.activeEnemyItem === undefined)
      return Battle.logger.error('Try update battle count but enemy was undefined');

    const enemyId = this.activeEnemyItem.id;

    if (this.battleCountMap.has(this.activeEnemyItem.id)) {
      let currentCount = this.battleCountMap.get(enemyId);

      if (currentCount !== undefined) {
        this.battleCountMap.set(enemyId, currentCount + 1);
      }
    } else {
      this.battleCountMap.set(enemyId, 1);
    }
  };

  private generateEnemyId = (enemyId: string) => {
    const currentEnemyBattleCount = this.battleCountMap.get(enemyId);
    return enemyId + `${currentEnemyBattleCount ?? 0}`;
  };

  /**
   * 收集奖励到战利品池
   */
  private collectRewardToPool = async () => {
    if (!this.enemy) return Battle.logger.error('Try to collection Enemy reward to pool but undefined');

    this.rewardPool.push(...this.enemy.provideRewards());
  };

  /**
   * 发放战利品奖励
   */
  public executeRewardPool = () => {
    if (!this.hasReward) {
      return Battle.logger.error('Try to execute rewards but reward pool was empty');
    }

    this.rewardPool.forEach((reward) => {
      reward.execute();
    });
    this.rewardPool = [];
  };
}

const battle = Battle.create();

export { battle, Battle };

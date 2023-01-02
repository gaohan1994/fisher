import { makeAutoObservable, reaction } from 'mobx';
import {
  Enemy,
  FisherBattleAreaItem,
  FisherBattleEnemyItem,
  FisherReward,
  FisherTimerSpace,
  master,
  useModulePackage,
} from '@FisherCore';
import { prefixes, prefixLogger } from '@FisherLogger';

export class FisherBattle {
  private static logger = prefixLogger(prefixes.FISHER_CORE, 'FisherBattle');

  public static BaseBattleInterval = 2000;

  public readonly packages: FisherBattleAreaItem[] =
    useModulePackage('BattleAreas');

  public inBattle = false;

  public master = master;

  public activeEnemyItem?: FisherBattleEnemyItem | undefined = undefined;

  public enemy: Enemy | undefined = undefined;

  /**
   * 触发玩家死亡
   */
  public get masterDeathCondition() {
    return this.inBattle === true && this.master.Hp <= 0;
  }

  /**
   * 触发敌人死亡
   */
  public get enemyDeathCondition() {
    return (
      this.inBattle === true && this.enemy !== undefined && this.enemy.Hp <= 0
    );
  }

  /**
   * 击杀数统计
   */
  public battleCountMap = new Map<string, number>();

  /**
   * 战利品池
   */
  public rewardPool: FisherReward[] = [];

  /**
   * 是否有战利品
   */
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
   * @param {FisherBattleEnemyItem} enemyItem
   * @memberof FisherBattle
   */
  public initializeEnemy = async (enemyItem: FisherBattleEnemyItem) => {
    this.activeEnemyItem = enemyItem;
    this.enemy = new Enemy(this.generateEnemyId(enemyItem.id), enemyItem);
    this.enemy.setTarget(this.master);
    this.master.setTarget(this.enemy);
  };

  /**
   * 重新初始化敌人
   *
   * @memberof FisherBattle
   */
  public reinitializeEnemy = async () => {
    if (this.activeEnemyItem === undefined)
      return FisherBattle.logger.error(
        'Try to reinitialize Enemy but active enemy was undefined'
      );

    await this.initializeEnemy(this.activeEnemyItem);
  };

  public start = async (enemyItem?: FisherBattleEnemyItem) => {
    const currentEnemy = enemyItem ?? this.activeEnemyItem;
    if (currentEnemy === undefined)
      return FisherBattle.logger.error('Try to start battle without enemy');

    await this.initializeEnemy(currentEnemy);
    await FisherTimerSpace.space(FisherBattle.BaseBattleInterval);

    this.master.startBattle();
    this.enemy?.startBattle();

    this.setInBattle();
  };

  public stop = async () => {
    if (this.enemy === undefined) {
      return FisherBattle.logger.error(
        'Try to stop battle but enemy was undefined'
      );
    }

    if (this.inBattle === false) {
      return FisherBattle.logger.error('Try to stop battle but already stoped');
    }

    this.master.stopBattle();
    this.enemy.stopBattle();
    this.setNotInBattle();
  };

  /**
   * 玩家死亡
   * - 停止战斗
   * - 死亡惩罚
   *
   * @memberof FisherBattle
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
   * @memberof FisherBattle
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
      return FisherBattle.logger.error(
        'Try update battle count but enemy was undefined'
      );

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

  private setInBattle = () => {
    this.inBattle = true;
  };

  private setNotInBattle = () => {
    this.inBattle = false;
  };

  private generateEnemyId = (enemyId: string) => {
    const currentEnemyBattleCount = this.battleCountMap.get(enemyId);
    return enemyId + `${currentEnemyBattleCount ?? 0}`;
  };

  /**
   * 收集奖励到战利品池
   */
  private collectRewardToPool = async () => {
    if (!this.enemy)
      return FisherBattle.logger.error(
        'Try to collection Enemy reward to pool but undefined'
      );

    this.rewardPool.push(...this.enemy.provideRewards());
  };

  /**
   * 发放战利品奖励
   */
  public executeRewardPool = () => {
    if (!this.hasReward) {
      return FisherBattle.logger.error(
        'Try to execute rewards but reward pool was empty'
      );
    }

    this.rewardPool.forEach((reward) => {
      reward.executeRewards();
    });
    this.rewardPool = [];
  };
}

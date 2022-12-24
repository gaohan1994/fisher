import { makeAutoObservable, reaction } from 'mobx';
import { Enemy, FisherPerson, FisherReward, master, Master } from '@FisherCore';
import { prefixes, prefixLogger } from '@FisherLogger';

interface IFisherBattle {
  enemy: Enemy;
}

export class FisherBattle {
  private static logger = prefixLogger(prefixes.FISHER_CORE, 'FisherBattle');

  public inBattle = false;

  public enemyIndex = 0;

  public master = master;

  public enemy?: Enemy = undefined;

  /**
   * 奖励池
   *
   * @type {FisherReward[]}
   * @memberof FisherBattle
   */
  public rewardPool: FisherReward[] = [];

  constructor() {
    makeAutoObservable(this);

    reaction(
      () => this.master !== undefined && this.master.Hp <= 0,
      this.onMasterDeath
    );

    reaction(
      () => this.enemy !== undefined && this.enemy.Hp <= 0,
      this.onEnemyDeath
    );
  }

  public initialize = ({ enemy }: IFisherBattle) => {
    this.enemy = enemy;
    this.master.setTarget(this.enemy);
    this.enemy.setTarget(this.master);
  };

  public start = () => {
    if (!this.enemy)
      return FisherBattle.logger.error('Try to start battle without enemy');
    this.master.startBattle();
    this.enemy.startBattle();
    this.inBattle = true;
  };

  public stop = () => {
    if (this.inBattle === false) {
      return FisherBattle.logger.error('Try to stop battle but already stoped');
    }
    this.master?.stopBattle();
    this.enemy?.stopBattle();
    this.inBattle = false;
  };

  /**
   * 玩家死亡
   * - 停止战斗
   * - 死亡惩罚
   *
   * @memberof FisherBattle
   */
  public onMasterDeath = () => {
    this.stop();
    this.master.deathPenalty();
  };

  /**
   * 敌人死亡
   * - 停止战斗
   * - 奖励池更新奖励
   * - 初始化下一个敌人
   * - 再次进入战斗
   *
   * @memberof FisherBattle
   */
  public onEnemyDeath = () => {
    if (!this.enemy)
      return FisherBattle.logger.error('Enemy death but undefined');
    this.stop();
    this.rewardPool.push(...this.enemy.provideRewards());
  };
}

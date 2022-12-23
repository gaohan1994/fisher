import { FisherPerson } from '@FisherCore';
import { prefixes, prefixLogger } from '@FisherLogger';
import { makeAutoObservable, reaction, when } from 'mobx';

interface IFisherBattle {
  master: FisherPerson;
  enemy: FisherPerson;
}

export class FisherBattle {
  private static logger = prefixLogger(prefixes.FISHER_CORE, 'FisherBattle');
  public inBattle = false;
  public master?: FisherPerson = undefined;
  public enemy?: FisherPerson = undefined;

  constructor() {
    makeAutoObservable(this);

    when(
      () => this.master !== undefined && this.master.Hp <= 0,
      this.onMasterDeath
    );

    reaction(
      () => this.enemy !== undefined && this.enemy.Hp <= 0,
      this.onEnemyDeath
    );
  }

  public initialize = ({ master, enemy }: IFisherBattle) => {
    this.master = master;
    this.enemy = enemy;
    this.master.setTarget(this.enemy);
    this.enemy.setTarget(this.master);
  };

  public start = () => {
    this.master?.startBattle();
    this.enemy?.startBattle();
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
  public onMasterDeath = () => {};

  /**
   * 敌人死亡
   * - 停止战斗
   * - 发放奖励
   * - 初始化下一个敌人
   *
   * @memberof FisherBattle
   */
  public onEnemyDeath = () => {};
}

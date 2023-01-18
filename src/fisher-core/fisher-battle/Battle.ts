import { makeAutoObservable } from 'mobx';
import { prefixes, prefixLogger } from '@FisherLogger';
import { store } from '../fisher-packages';
import { EnemyItem } from '../fisher-item';
import { RewardPool } from '../fisher-reward';
import { TimerSpace } from '../fisher-timer';
import { EventKeys, events } from '../fisher-events';
import { BattleStatus } from './BattleStatus';
import { BattleControl } from './BattleControl';
import { Enemy } from '../fisher-person';

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

  public name = '斩妖除魔';

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

  public battleControl = new BattleControl();

  public get master() {
    return this.battleControl.master;
  }

  public get enemy() {
    return this.battleControl.enemy;
  }

  public rewardPool = new RewardPool();

  constructor() {
    makeAutoObservable(this);
    events.on(EventKeys.Core.MasterDeath, this.onMasterDeath);
    events.on(EventKeys.Core.EnemyDeath, this.onEnemyDeath);
  }

  public setEnemyItem = async (enemyItem: EnemyItem) => {
    this.battleStatus.enemyLoading();
    this.battleControl.setAcitveEnemyItem(enemyItem);
    await TimerSpace.space(Battle.BaseBattleInterval);
  };

  public start = async () => {
    if (this.battleControl.enemy === undefined) {
      Battle.logger.error('Fail to start battle, please set active enemy item first', this);
      throw new Error('Fail to start battle, please set active enemy item first');
    }

    this.battleStatus.fighting();
    this.battleControl.startBattle();

    events.emit(EventKeys.Core.SetActiveComponent, this);
  };

  public stop = async () => {
    if (!this.isFighting) {
      return Battle.logger.error('Try to stop battle but already stoped');
    }

    this.battleStatus.initial();
    this.battleControl.stopBattle();
  };

  private onMasterDeath = async () => {
    this.battleStatus.initial();
  };

  private onEnemyDeath = async (enemy: Enemy) => {
    this.collectRewards(enemy);
  };

  private collectRewards = async (enemy: Enemy) => {
    this.rewardPool.collectRewards(enemy.provideRewards());
  };

  public executeRewards = () => {
    this.rewardPool.executeRewardPool();
  };
}

const battle = Battle.create();

export { battle, Battle };

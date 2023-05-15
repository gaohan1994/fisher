import { makeAutoObservable } from 'mobx';
import { prefixes, prefixLogger } from '@FisherLogger';
import { store } from '../fisher-packages';
import { EnemyItem } from '../fisher-item';
import { RewardPool } from '../fisher-reward';
import { TimerSpace } from '../fisher-timer';
import { EventKeys, events } from '../fisher-events';
import { Enemy, Master } from '../fisher-person';
import { Assets } from '../assets';
import { Fight } from '../fisher-fight';
import { FisherBattleError } from '../fisher-error';

class Battle {
  private static readonly logger = prefixLogger(prefixes.FISHER_CORE, 'Battle');

  private static instance: Battle;

  public static create(): Battle {
    if (!Battle.instance) {
      Battle.instance = new Battle();
    }
    return Battle.instance;
  }

  public get packages() {
    return store.BattleAreas;
  }

  private static readonly BaseBattleInterval = 200;

  public readonly id = 'Battle';

  public name = '除魔';

  public media = Assets.battle;

  public fight = new Fight();

  private activeEnemyItem: EnemyItem | undefined = undefined;

  public get master() {
    return this.fight.info.master;
  }

  public get enemy() {
    return this.fight.info.enemy;
  }

  public get isAttacking() {
    return this.fight.info.isAttacking;
  }

  public rewardPool = new RewardPool();

  constructor() {
    makeAutoObservable(this);
    this.fight.event.on(Fight.EventKeys.MasterWinFight, this.onMasterWinFight);
    this.fight.event.on(Fight.EventKeys.MasterLostFight, this.onMasterLostFight);
  }

  public setAcitveEnemyItem = async (enemyItem: EnemyItem | undefined) => {
    this.activeEnemyItem = enemyItem;
  };

  public start = async () => {
    if (this.activeEnemyItem === undefined) {
      throw new FisherBattleError('Fail to start battle, please set active enemy', '请先设置战斗目标');
    }

    this.fight.startFighting(new Enemy(this.activeEnemyItem));
    events.emit(EventKeys.Core.SetActiveComponent, this);
    Battle.logger.info(`Start battle with enemy ${this.activeEnemyItem.name}`);
  };

  public stop = async () => {
    this.fight.stopFighting();
    Battle.logger.info('Stop battle');
  };

  private onMasterLostFight = async () => {};

  private onMasterWinFight = async (_: Master, enemy: Enemy) => {
    this.collectRewards(enemy);
    await this.continueNextFight();
  };

  private collectRewards = async (enemy: Enemy) => {
    this.rewardPool.collectRewards(enemy.provideRewards());
  };

  private continueNextFight = async () => {
    if (this.activeEnemyItem !== undefined) {
      await TimerSpace.space(Battle.BaseBattleInterval);
      this.fight.startFighting(new Enemy(this.activeEnemyItem));
    }
  };

  public executeRewards = () => {
    this.rewardPool.executeRewardPool();
  };
}

const battle = Battle.create();

export { battle, Battle };

import { makeAutoObservable } from 'mobx';
import { prefixes, prefixLogger } from '@fisher/logger';
import { Assets } from '../assets';
import { FisherCore } from '../fisher-core';
import { store } from '../fisher-packages';
import { EnemyItem } from '../fisher-item';
import { TimerSpace } from '../fisher-timer';
import { EventKeys, events } from '@shared';
import { Enemy, Master } from '../fisher-person';
import { Fight } from '../fisher-fight';
import { RewardPool } from '../fisher-reward';
import { FisherBattleError } from '@shared';
import { ArchiveInterface } from '../fisher-archive';
import { generateTimestamp } from '../utils';
import { HangUpBattleManager, HangUpTime } from '../fisher-hang-up';

class Battle {
  private static readonly logger = prefixLogger(prefixes.FISHER_CORE, 'Battle');

  private static instance: Battle;

  public static create(): Battle {
    if (!Battle.instance) {
      Battle.instance = new Battle();
    }
    return Battle.instance;
  }

  public get archive(): ArchiveInterface.ArchiveBattle {
    return {
      activeEnemyId: this.activeEnemyItem?.id,
    };
  }

  public get packages() {
    return store.BattleAreas;
  }

  private static readonly BaseBattleInterval = 200;

  public readonly id = 'Battle';

  public name = '除魔';

  public media = Assets.battle;

  public fight: Fight | undefined = undefined;

  public activeEnemyItem: EnemyItem | undefined = undefined;

  private pauseTime: number | undefined = undefined;

  public get isPaused() {
    return this.pauseTime !== undefined;
  }

  public get master() {
    return this.fight?.info.master;
  }

  public get enemy() {
    return this.fight?.info.enemy;
  }

  public get isAttacking() {
    return this.fight?.info.isAttacking ?? false;
  }

  public rewardPool = new RewardPool();

  private constructor() {
    makeAutoObservable(this);
  }

  public pause = () => {
    if (this.fight === undefined) {
      throw new FisherBattleError(`Try to pause component ${this.id}, but can not find active fight`, '请设置战斗');
    }

    events.emit(EventKeys.Archive.SaveFullArchive);
    this.fight.pauseFighting();
    this.pauseTime = generateTimestamp();
  };

  public continue = async (core: FisherCore) => {
    if (this.pauseTime === undefined) {
      throw new FisherBattleError(
        `Try to continue component ${this.id}, but pause time was undefined`,
        '组件挂机失败，请检查挂机时间'
      );
    }
    if (this.activeEnemyItem === undefined || this.fight === undefined) {
      throw new FisherBattleError(`Try to continue component ${this.id}, but can not find active fight`, '请设置战斗');
    }

    new HangUpBattleManager(
      new HangUpTime(this.pauseTime),
      { activeEnemyId: this.activeEnemyItem.id },
      core.archiveManager.getActiveArchiveValues()!
    );
    this.pauseTime = undefined;
    this.start();
  };

  public setAcitveEnemyItem = (enemyItem: EnemyItem) => {
    this.activeEnemyItem = enemyItem;
  };

  public clearActiveEnemyItem = () => {
    this.activeEnemyItem = undefined;
  };

  private clearFight = () => {
    if (this.fight === undefined) {
      throw new FisherBattleError(`Try to stop an undefined fight`, '没有找到要停止的战斗');
    }

    this.fight.stopFighting();
    this.fight = undefined;
  };

  public start = () => {
    if (this.activeEnemyItem === undefined) {
      throw new FisherBattleError('Fail to start battle, please set active enemy', '请先设置战斗目标');
    }

    this.fight = this.createBattleFight(new Enemy(this.activeEnemyItem));
    events.emit(EventKeys.Core.SetActiveComponent, this);

    Battle.logger.info(`Start battle with enemy ${this.activeEnemyItem.name}`);
  };

  public stop = () => {
    this.clearFight();
    this.clearActiveEnemyItem();

    Battle.logger.info('Stop battled');
  };

  private onMasterWinFight = async (_: Master, enemy: Enemy) => {
    this.collectRewards(enemy);
    await TimerSpace.space(Battle.BaseBattleInterval);
    this.continueNextFight();
  };

  private onMasterLostFight = () => {
    this.master!.event.emit(Master.MasterEventKeys.MasterDeath);
    this.executeRewards();
    this.stop();
  };

  private collectRewards = async (enemy: Enemy) => {
    enemy.executeExperienceRewards();
    this.rewardPool.collectRewards(enemy.provideRewards());
  };

  private continueNextFight = () => {
    if (this.activeEnemyItem !== undefined) {
      this.fight = this.createBattleFight(new Enemy(this.activeEnemyItem));
    }
  };

  public executeRewards = () => {
    this.rewardPool.executeRewardPool(true);
  };

  private createBattleFight = (enemy: Enemy) => {
    const fight = Fight.create(enemy);

    fight.event.on(Fight.EventKeys.MasterWinFight, this.onMasterWinFight);
    fight.event.on(Fight.EventKeys.MasterLostFight, this.onMasterLostFight);
    fight.startFighting();

    return fight;
  };
}

export { Battle };

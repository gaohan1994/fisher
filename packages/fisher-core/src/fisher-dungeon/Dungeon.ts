import { makeAutoObservable } from 'mobx';
import { prefixLogger, prefixes } from '@fisher/logger';
import { Assets } from '@assets';
import { Fight } from '@fight';
import { FisherCore } from '@core';
import { DungeonItem } from '@item';
import { RewardPool } from '@reward';
import { Enemy, Master } from '@person';
import { TimerSpace } from '@timer';
import { EventKeys, events, FisherDungeonError } from '@shared';
import { HangUpDungeonManager, HangUpTime } from '@hangUp';
import { store } from '../fisher-packages/index.js';
import { ArchiveInterface } from '../fisher-archive/index.js';
import { generateTimestamp } from '../utils/index.js';
import { DungeonItemHandler } from './DungeonItemHandler.js';

class Dungeon {
  private static readonly logger = prefixLogger(prefixes.FISHER_CORE, 'Dungeon');

  private static instance: Dungeon;

  public static create(): Dungeon {
    if (!Dungeon.instance) {
      Dungeon.instance = new Dungeon();
    }
    return Dungeon.instance;
  }

  public get archive(): ArchiveInterface.ArchiveDungeon {
    return {
      activeDungeonItemId: this.activeDungeonItem?.id,
      current: this.dungeonItemHandler?.current,
    };
  }

  private static readonly BaseInterval = 200;

  public get packages() {
    return store.Dungeons;
  }

  public readonly id = 'Dungeon';

  public name = '副本';

  public media = Assets.dungeon;

  public fight: Fight | undefined = undefined;

  public activeDungeonItem: DungeonItem | undefined = undefined;

  private dungeonItemHandler: DungeonItemHandler | undefined = undefined;

  public rewardPool = new RewardPool();

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

  private constructor() {
    makeAutoObservable(this);
  }

  public pause = () => {
    if (this.fight === undefined) {
      throw new FisherDungeonError(`Try to pause component ${this.id}, but can not find active fight`, '请设置战斗');
    }

    events.emit(EventKeys.Archive.SaveFullArchive);
    this.fight.pauseFighting();
    this.pauseTime = generateTimestamp();
  };

  public continue = async (core: FisherCore) => {
    if (this.pauseTime === undefined) {
      throw new FisherDungeonError(
        `Try to continue component ${this.id}, but pause time was undefined`,
        '组件挂机失败，请检查挂机时间'
      );
    }
    if (this.activeDungeonItem === undefined || this.fight === undefined) {
      throw new FisherDungeonError(`Try to continue component ${this.id}, but can not find active fight`, '请设置战斗');
    }

    new HangUpDungeonManager(
      new HangUpTime(this.pauseTime),
      { activeDungeonItemId: this.activeDungeonItem.id, current: this.dungeonItemHandler?.current },
      core.archiveManager.activeArchive?.values!
    );
    this.pauseTime = undefined;
    this.start();
  };

  public setActiveDungeonItem = (dungeonItem: DungeonItem) => {
    this.activeDungeonItem = dungeonItem;
  };

  public clearActiveDungeonItem = () => {
    this.activeDungeonItem = undefined;
  };

  public start = () => {
    const master = Master.create();
    if (this.activeDungeonItem === undefined) {
      throw new FisherDungeonError('Fail to start dungeon, please set active dungeon', '请先设置要攻略的副本');
    }

    if (this.fight !== undefined) {
      throw new FisherDungeonError(
        `Current dungeon was active with ${this.activeDungeonItem.id}, should stop dungeon first`,
        '请先停止当前副本后，在挑战新副本'
      );
    }

    if (this.activeDungeonItem.unlockLevel > master.level) {
      throw new FisherDungeonError('Master insufficient level', '等级不足');
    }

    events.emit(EventKeys.Core.SetActiveComponent, this);
    this.startDungeon(this.activeDungeonItem);
    Dungeon.logger.info(`Start Dungeon ${this.activeDungeonItem.name}`);
  };

  private startDungeon = (dungeonItem: DungeonItem) => {
    this.dungeonItemHandler = new DungeonItemHandler(dungeonItem);
    this.fight = this.createDungeonFight(new Enemy(this.dungeonItemHandler.currentEnemy));
  };

  public stop = () => {
    this.clearDungeonFight();
    this.clearActiveDungeonItem();
    Dungeon.logger.info('Stop Dungeon');
  };

  private onMasterLostFight = async () => {
    this.master!.event.emit(Master.MasterEventKeys.MasterDeath);
    this.executeRewards();
    this.stop();
  };

  private onMasterWinFight = async (_: Master, enemy: Enemy) => {
    enemy.executeExperienceRewards();
    this.collectRewards(enemy);
    await TimerSpace.space(Dungeon.BaseInterval);
    this.continueNextFight();
  };

  private continueNextFight = () => {
    if (this.dungeonItemHandler === undefined || !this.dungeonItemHandler.hasNextEnemy) {
      return this.stop();
    }
    this.fight = this.createDungeonFight(new Enemy(this.dungeonItemHandler.findNextEnemy()!));
  };

  private collectRewards = (enemy: Enemy) => {
    this.rewardPool.collectRewards(enemy.provideRewards());
  };

  public executeRewards = () => {
    this.rewardPool.executeRewardPool(true);
  };

  private createDungeonFight = (enemy: Enemy) => {
    const fight = Fight.create(enemy);

    fight.event.on(Fight.EventKeys.MasterWinFight, this.onMasterWinFight);
    fight.event.on(Fight.EventKeys.MasterLostFight, this.onMasterLostFight);
    fight.startFighting();

    return fight;
  };

  private clearDungeonFight = () => {
    if (this.fight === undefined) {
      throw new FisherDungeonError(`Try to stop an undefined fight`, '没有找到要停止的战斗');
    }

    this.fight.stopFighting();
    this.fight = undefined;
  };
}

export { Dungeon };

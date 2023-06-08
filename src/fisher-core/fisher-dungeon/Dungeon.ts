import { makeAutoObservable } from 'mobx';
import { prefixLogger, prefixes } from '@FisherLogger';
import { Assets } from '../assets';
import { Fight } from '../fisher-fight';
import { DungeonItem } from '../fisher-item';
import { Reward, RewardPool } from '../fisher-reward';
import { Enemy, Master } from '../fisher-person';
import { TimerSpace } from '../fisher-timer';
import { FisherDungeonError } from '../fisher-error';
import { EventKeys, events } from '../fisher-events';
import { store } from '../fisher-packages';
import { ArchiveInterface } from '../fisher-archive';

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
      progress: this.activeDungeonItem?.progress,
    };
  }

  private static readonly BaseInterval = 200;

  public get packages() {
    return store.Dungeons;
  }

  public readonly id = 'Dungeon';

  public name = '副本';

  public media = Assets.battle;

  public fight: Fight | undefined = undefined;

  public activeDungeonItem: DungeonItem | undefined = undefined;

  public rewardPool = new RewardPool();

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

    if (this.activeDungeonItem.unlockLevel > master.level) {
      throw new FisherDungeonError('Master insufficient level', '等级不足');
    }

    events.emit(EventKeys.Core.SetActiveComponent, this);
    this.fight = this.createDungeonFight(new Enemy(this.activeDungeonItem.currentEnemyItem));

    Dungeon.logger.info(`Start Dungeon ${this.activeDungeonItem.name}`);
  };

  public stop = () => {
    this.clearDungeonFight();
    this.clearActiveDungeonItem();

    Dungeon.logger.info('Stop Dungeon');
  };

  public pause = () => {
    if (this.fight === undefined) {
      throw new FisherDungeonError('Try to pause an undefined fight', '没有找到要暂停的战斗');
    }
    events.emit(EventKeys.Archive.SaveFullArchive);
    this.fight.pauseFighting();
  };

  private onMasterLostFight = async () => {
    this.master!.event.emit(Master.MasterEventKeys.MasterDeath);
    this.executeRewards();
    this.stop();
  };

  private onMasterWinFight = async (_: Master, enemy: Enemy) => {
    enemy.executeExperienceRewards();
    this.collectRewards(enemy);
    this.collectProgressExtraReward(enemy);

    await TimerSpace.space(Dungeon.BaseInterval);

    this.continueNextFight();
  };

  private continueNextFight = () => {
    if (this.activeDungeonItem !== undefined) {
      this.fight = this.createDungeonFight(new Enemy(this.activeDungeonItem.nextEnemy()));
    }
  };

  private collectRewards = (enemy: Enemy) => {
    this.rewardPool.collectRewards(enemy.provideRewards());
  };

  private collectProgressExtraReward = (enemy: Enemy) => {
    if (this.activeDungeonItem === undefined) {
      throw new FisherDungeonError(
        'Try to collect progress extra reward without an active dungeon',
        '请先设置要攻略的副本'
      );
    }

    const extraReward = this.activeDungeonItem?.tryGetProgressExtraRewards(enemy.id);

    if (extraReward !== undefined) {
      this.rewardPool.collectRewards(extraReward.map(Reward.create));
    }
  };

  public executeRewards = () => {
    this.rewardPool.executeRewardPool();
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

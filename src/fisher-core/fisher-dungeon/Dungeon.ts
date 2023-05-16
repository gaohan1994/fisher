import { prefixLogger, prefixes } from '@FisherLogger';
import { Assets } from '../assets';
import { Fight } from '../fisher-fight';
import { DungeonItem } from '../fisher-item';
import { RewardPool } from '../fisher-reward';
import { makeAutoObservable } from 'mobx';
import { Enemy, Master } from '../fisher-person';
import { TimerSpace } from '../fisher-timer';
import { FisherDungeonError } from '../fisher-error';
import { EventKeys, events } from '../fisher-events';

class Dungeon {
  private static readonly logger = prefixLogger(prefixes.FISHER_CORE, 'Dungeon');

  private static instance: Dungeon;

  public static create(): Dungeon {
    if (!Dungeon.instance) {
      Dungeon.instance = new Dungeon();
    }
    return Dungeon.instance;
  }

  private static readonly BaseInterval = 200;

  public readonly id = 'Dungeon';

  public name = '副本';

  public media = Assets.battle;

  public fight = new Fight();

  public activeDungeonItem: DungeonItem | undefined = undefined;

  public rewardPool = new RewardPool();

  public get master() {
    return this.fight.info.master;
  }

  public get enemy() {
    return this.fight.info.enemy;
  }

  public get isAttacking() {
    return this.fight.info.isAttacking;
  }

  constructor() {
    makeAutoObservable(this);
    this.fight.event.on(Fight.EventKeys.MasterWinFight, this.onMasterWinFight);
    this.fight.event.on(Fight.EventKeys.MasterLostFight, this.onMasterLostFight);
  }

  public setActiveDungeonItem = (dungeonItem: DungeonItem) => {
    this.activeDungeonItem = dungeonItem;
  };

  public start = async () => {
    if (this.activeDungeonItem === undefined) {
      throw new FisherDungeonError('Fail to start dungeon, please set active dungeon', '请先设置要攻略的副本');
    }

    this.fight.startFighting(new Enemy(this.activeDungeonItem.currentEnemyItem));
    events.emit(EventKeys.Core.SetActiveComponent, this);
    Dungeon.logger.info(`Start Dungeon ${this.activeDungeonItem.name}`);
  };

  public stop = async () => {
    this.fight.stopFighting();
    Dungeon.logger.info('Stop Dungeon');
  };

  private onMasterLostFight = async () => {};

  private onMasterWinFight = async (_: Master, enemy: Enemy) => {
    this.collectRewards(enemy);
    this.collectProgressExtraReward(enemy);
    await this.continueNextFight();
  };

  private continueNextFight = async () => {
    if (this.activeDungeonItem !== undefined) {
      await TimerSpace.space(Dungeon.BaseInterval);
      this.fight.startFighting(new Enemy(this.activeDungeonItem.nextEnemy()));
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

    const extraReward = this.activeDungeonItem?.tryGetProgressExtraReward(enemy);

    if (extraReward !== undefined) {
      this.rewardPool.collectRewards(extraReward);
    }
  };

  public executeRewards = () => {
    this.rewardPool.executeRewardPool();
  };
}

const dungeon = Dungeon.create();

export { Dungeon, dungeon };

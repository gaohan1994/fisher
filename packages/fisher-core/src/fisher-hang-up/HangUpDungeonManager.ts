import { makeAutoObservable } from 'mobx';
import { prefixLogger, prefixes } from '@fisher/logger';
import { ArchiveInterface } from '@archive';
import { DungeonItemHandler } from '@dungeon';
import { fakeClock } from '@timer';
import { DungeonItem } from '@item';
import { Enemy, Master } from '@person';
import { RewardCache, RewardPool } from '@reward';
import { Information, informationAlert } from '@information';
import { roll } from '../utils/index.js';
import { store } from '../fisher-packages/index.js';
import { ComponentId } from '../fisher-core/index.js';
import { FakeFight } from './FakeFight.js';
import { HangUpTime } from './HangUpTime.js';
import { HangUpInformation } from './HangUpInformation.js';

class HangUpDungeonManager {
  private static readonly logger = prefixLogger(prefixes.FISHER_CORE, 'HangUpDungeonManager');

  private static Interval = 200;

  private time: HangUpTime;

  private hangUpDuration = 0;

  private get availableTimeDuration() {
    return this.time.diff - this.hangUpDuration;
  }

  public dungeonItem: DungeonItem;

  private readonly dungeonItemHandler: DungeonItemHandler;

  private realMaster: Master = Master.create();

  private fakeMaster: Master;

  private fightVictoryTimes = 0;

  private rewardPool = new RewardPool();

  private rewardCache = new RewardCache();

  private unsubscribeCallbacks = new Map<number, Array<() => void>>();

  constructor(
    time: HangUpTime,
    { activeDungeonItemId, current }: ArchiveInterface.ArchiveDungeon,
    values: ArchiveInterface.ArchiveValues
  ) {
    makeAutoObservable(this);

    this.time = time;

    this.dungeonItem = store.findItemById<DungeonItem>(activeDungeonItemId!);
    this.dungeonItemHandler = new DungeonItemHandler(this.dungeonItem);
    this.dungeonItemHandler.setCurrent(current ?? 0);

    /**
     * Make a fake master
     * User can start other components
     * when hang up module calculating
     */
    this.fakeMaster = new Master();
    this.fakeMaster.onLoadMaster(values);

    try {
      this.dungeonHangUpStart();
    } catch (error) {
      this.dungeonHangUpEnd();
      HangUpDungeonManager.logger.error(`Got error when try hang up dungeon`, error);
    }
  }

  private dungeonHangUpStart = () => {
    HangUpInformation.startLoading(['正在计算挂机收益....']);
    this.createFakeFight();
  };

  private dungeonHangUpEnd = () => {
    HangUpInformation.stopLoading();
    this.clearHangUpEffects();
    this.executeCacheRewards();
  };

  private createFakeFight = () => {
    const fight = FakeFight.create(this.fakeMaster, new Enemy(this.dungeonItemHandler.findNextEnemy()!));

    this.unsubscribeCallbacks.set(fight.id, [
      fight.event.on(FakeFight.EventKeys.MasterWinFight, this.onMasterWinFight),
      fight.event.on(FakeFight.EventKeys.MasterLostFight, this.onMasterLostFight),
    ]);

    HangUpDungeonManager.logger.debug(`Create and start a new fake fight with dungeon id ${this.dungeonItem.id}`);
  };

  private continueNextFakeFight = () => {
    fakeClock.clock.setTimeout(() => {
      this.accumulateDuration(HangUpDungeonManager.Interval);
      this.createFakeFight();
    }, HangUpDungeonManager.Interval);

    fakeClock.clock.tick(HangUpDungeonManager.Interval);
  };

  /**
   * Unsubscribe registe functions first!
   *
   * When master win fake fight
   * collect rewards
   *
   * if time is available try to start the next fake fight
   * else execute all collect rewards
   *
   * @param fightId
   * @param _master
   * @param _enemy
   * @param fakeFightDuration
   */
  private onMasterWinFight = async (fightId: number, _master: Master, _enemy: Enemy, fakeFightDuration: number) => {
    this.unsubscribeFightEvents(fightId);
    this.accumulateDuration(fakeFightDuration);

    if (fakeFightDuration < this.availableTimeDuration) {
      this.fightVictoryTimes += 1;
      this.collectEnemyRewards(_enemy);
      this.continueNextFakeFight();
    } else {
      this.dungeonHangUpEnd();
    }
  };

  /**
   * Unsubscribe registe functions first!
   *
   * When master lost fake fight
   * trigger master death event
   * execute all collect rewards
   *
   * Note: Trigger real master death punish when fake master death
   *
   * @param fightId
   * @param _master
   * @param _enemy
   * @param fakeFightDuration
   */
  private onMasterLostFight = (fightId: number, _master: Master, _enemy: Enemy, fakeFightDuration: number) => {
    this.unsubscribeFightEvents(fightId);
    this.accumulateDuration(fakeFightDuration);

    this.dungeonHangUpEnd();
    this.realMaster.event.emit(Master.MasterEventKeys.MasterDeath);
  };

  private executeCacheRewards = () => {
    const messages = [
      new Information.NormalMessage(`您离开了${this.time.durationFormat}`, Information.InformationColor.Orange),
      new Information.NormalMessage(
        `您通关了${this.fightVictoryTimes}次【${this.dungeonItem.name}】副本`,
        Information.InformationColor.Green
      ),
    ];
    informationAlert(messages);

    this.rewardPool.collectRewards(this.rewardCache.createRewards(ComponentId.Master));
    this.rewardPool.executeRewardPool(true);
    this.rewardCache.clearCache();
  };

  private collectEnemyRewards = (enemy: Enemy) => {
    if (enemy.goldReward) {
      this.rewardCache.cacheGold(enemy.goldReward);
    }

    if (enemy.hasExperienceRewards) {
      this.rewardCache.cacheExperience(enemy.experienceRewards);
    }

    if (enemy.hasItemRewards) {
      this.rewardCache.cacheItems(enemy.itemRewards);
    }

    if (enemy.hasRandomRewards) {
      for (let index = 0; index < enemy.randomRewards.length; index++) {
        const item = enemy.randomRewards[index];
        if (!roll(item.probability)) break;
        this.rewardCache.cacheItems([item]);
      }
    }
  };

  private accumulateDuration = (duration: number) => {
    this.hangUpDuration += duration;
  };

  private clearHangUpEffects = () => {
    if (this.unsubscribeCallbacks.size > 0) {
      [...this.unsubscribeCallbacks.keys()].forEach(this.unsubscribeFightEvents);
    }

    this.fakeMaster.disposers.forEach((disposer) => disposer());

    fakeClock.clock.reset();
  };

  private unsubscribeFightEvents = (id: number) => {
    this.unsubscribeCallbacks.get(id)?.forEach((unsubscribeCallback) => unsubscribeCallback());
  };
}

export { HangUpDungeonManager };

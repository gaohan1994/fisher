import { makeAutoObservable } from 'mobx';
import { prefixLogger, prefixes } from '@FisherLogger';
import { roll } from '../utils';
import { store } from '../fisher-packages';
import { Enemy, Master } from '../fisher-person';
import { ComponentId } from '../fisher-core';
import { HangUpTime } from './HangUpTime';
import { FakeFight } from './FakeFight';
import { fakeClock } from '../fisher-timer';
import { DungeonItem } from '../fisher-item';
import { RewardCache, RewardPool } from '../fisher-reward';
import { Information, informationAlert } from '../fisher-information';
import { ArchiveInterface } from '../fisher-archive';
import { HangUpInformation } from './HangUpInformation';

class HangUpDungeonManager {
  private static readonly logger = prefixLogger(prefixes.FISHER_CORE, 'HangUpDungeonManager');

  private static Interval = 200;

  private time: HangUpTime;

  private hangUpDuration = 0;

  private get availableTimeDuration() {
    return this.time.diff - this.hangUpDuration;
  }

  public dungeonItem: DungeonItem;

  private realMaster: Master = Master.create();

  private fakeMaster: Master;

  private fightVictoryTimes = 0;

  private rewardPool = new RewardPool();

  private rewardCache = new RewardCache();

  private unsubscribeCallbacks = new Map<number, Array<() => void>>();

  constructor(
    time: HangUpTime,
    { activeDungeonItemId, progress }: ArchiveInterface.ArchiveDungeon,
    values: ArchiveInterface.ArchiveValues
  ) {
    makeAutoObservable(this);

    this.time = time;

    this.dungeonItem = store.findItemById<DungeonItem>(activeDungeonItemId!);
    if (progress !== undefined && progress > 0) {
      this.dungeonItem.setProgress(progress);
    }

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
    const fight = FakeFight.create(this.fakeMaster, new Enemy(this.dungeonItem.nextEnemy()));

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
      this.collectProgressExtraReward(_enemy);
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

  private collectProgressExtraReward = (enemy: Enemy) => {
    const extraReward = this.dungeonItem.tryGetProgressExtraRewards(enemy.id);

    if (extraReward !== undefined) {
      extraReward.forEach((reward) => {
        if (reward.gold && reward.gold > 0) {
          this.rewardCache.cacheGold(reward.gold);
        }

        if (reward.experience && reward.experience > 0) {
          this.rewardCache.cacheExperience(enemy.experienceRewards);
        }

        if (reward.itemId !== undefined) {
          this.rewardCache.cacheItems([{ itemId: reward.itemId, itemQuantity: reward.itemQuantity }]);
        }
      });
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

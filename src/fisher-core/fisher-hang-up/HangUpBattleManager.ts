import { makeAutoObservable } from 'mobx';
import { prefixLogger, prefixes } from '@FisherLogger';
import { roll } from '../utils';
import { store } from '../fisher-packages';
import { Enemy, Master } from '../fisher-person';
import { ComponentId } from '../fisher-core';
import { HangUpTime } from './HangUpTime';
import { FakeFight } from './FakeFight';
import { fakeClock } from '../fisher-timer';
import { EnemyItem } from '../fisher-item';
import { RewardCache, RewardPool } from '../fisher-reward';
import { Information, informationAlert } from '../fisher-information';
import { ArchiveInterface } from '../fisher-archive';
import { HangUpInformation } from './HangUpInformation';

class HangUpBattleManager {
  private static readonly logger = prefixLogger(prefixes.FISHER_CORE, 'HangUpBattleManager');

  private static Interval = 200;

  private time: HangUpTime;

  private hangUpDuration = 0;

  private get availableTimeDuration() {
    return this.time.diff - this.hangUpDuration;
  }

  public enemyItem: EnemyItem;

  private realMaster: Master = Master.create();

  private fakeMaster: Master;

  private fightVictoryTimes = 0;

  private rewardPool = new RewardPool();

  private rewardCache = new RewardCache();

  private unsubscribeCallbacks = new Map<number, Array<() => void>>();

  constructor(
    time: HangUpTime,
    { activeEnemyId }: ArchiveInterface.ArchiveBattle,
    values: ArchiveInterface.ArchiveValues
  ) {
    makeAutoObservable(this);

    this.time = time;
    this.enemyItem = store.findEnemyById(activeEnemyId!);

    /**
     * Make a fake master
     * User can start other components
     * when hang up module calculating
     */
    this.fakeMaster = new Master();
    this.fakeMaster.onLoadMaster(values);

    try {
      this.battleHangUpStart();
    } catch (error) {
      this.battleHangUpEnd();
      HangUpBattleManager.logger.error(`Got error when try hang up battle`, error);
    }
  }

  private battleHangUpStart = () => {
    HangUpInformation.startLoading(['正在计算挂机收益....']);
    this.createFakeFight();
  };

  private battleHangUpEnd = () => {
    HangUpInformation.stopLoading();
    this.clearHangUpBattleEffects();
    this.executeCacheRewards();
  };

  private continueNextFakeFight = () => {
    fakeClock.clock.setTimeout(() => {
      this.accumulateDuration(HangUpBattleManager.Interval);
      this.createFakeFight();
    }, HangUpBattleManager.Interval);

    fakeClock.clock.tick(HangUpBattleManager.Interval);
  };

  private createFakeFight = () => {
    const fight = FakeFight.create(this.fakeMaster, new Enemy(this.enemyItem));

    this.unsubscribeCallbacks.set(fight.id, [
      fight.event.on(FakeFight.EventKeys.MasterWinFight, this.onMasterWinFight),
      fight.event.on(FakeFight.EventKeys.MasterLostFight, this.onMasterLostFight),
    ]);

    HangUpBattleManager.logger.debug(`Create and start a new fake fight with enemy id ${this.enemyItem.id}`);
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
      this.battleHangUpEnd();
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

    this.battleHangUpEnd();
    this.realMaster.event.emit(Master.MasterEventKeys.MasterDeath);
  };

  private executeCacheRewards = () => {
    const messages = [
      new Information.NormalMessage(`您离开了${this.time.durationFormat}`, Information.InformationColor.Orange),
      new Information.NormalMessage(
        `您与${this.enemyItem.name}战斗胜利了${this.fightVictoryTimes}次`,
        Information.InformationColor.Green
      ),
    ];
    informationAlert(messages);

    this.rewardPool.collectRewards(this.rewardCache.createRewards(ComponentId.Master));
    this.rewardPool.executeRewardPool(true);
    this.rewardCache.clearCache();
  };

  private collectEnemyRewards = (enemy: Enemy) => {
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

  private clearHangUpBattleEffects = () => {
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

export { HangUpBattleManager };

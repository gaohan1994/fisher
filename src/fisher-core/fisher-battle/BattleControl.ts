import { prefixes, prefixLogger } from '@FisherLogger';
import { makeAutoObservable, reaction } from 'mobx';
import { EventEmitter } from 'smar-util';
import { EventKeys, events } from '../fisher-events';
import { EnemyItem } from '../fisher-item';
import { Enemy, Master } from '../fisher-person';

enum BattleControlEventKeys {
  EnemyChanged = 'EnemyChanged',
  ActiveEnemyItemChanged = 'ActiveEnemyItemChanged',
}

class BattleControl {
  private static logger = prefixLogger(prefixes.FISHER_CORE, 'BattleControl');

  public master = Master.create();

  public enemy: Enemy | undefined = undefined;

  public activeEnemyItem?: EnemyItem | undefined = undefined;

  private events = new EventEmitter();

  constructor() {
    makeAutoObservable(this);

    this.events.on(BattleControlEventKeys.EnemyChanged, this.onEnemyChanged);
    this.events.on(BattleControlEventKeys.ActiveEnemyItemChanged, this.onActiveEnemyChanged);

    reaction<boolean>(() => this.master.Hp <= 0, this.controlMasterDeath);
    reaction<boolean>(() => this.enemy !== undefined && this.enemy.Hp <= 0, this.controlEnemyDeath);
  }

  public setAcitveEnemyItem = (enemyItem: EnemyItem | undefined) => {
    this.activeEnemyItem = enemyItem;
    this.events.emit(BattleControlEventKeys.ActiveEnemyItemChanged, this.activeEnemyItem);
  };

  public startBattle = () => {
    if (this.enemy === undefined) {
      BattleControl.logger.error(`Try to start battle with undefined enemy`, this);
      throw new Error(`Try to start battle with undefined enemy`);
    }

    this.master.person.startBattle();
    this.enemy?.person.startBattle();
  };

  public stopBattle = () => {
    this.master.person.stopBattle();

    console.log('this.enemy', this.enemy);
    this.enemy?.person.stopBattle();
  };

  private onActiveEnemyChanged = (currentActiveEnemyItem: EnemyItem | undefined) => {
    // clear battle stuff first
    this.stopBattle();

    if (currentActiveEnemyItem === undefined) {
      this.clearEnemy();
    } else {
      this.createActiveEnemy();
    }
  };

  private onEnemyChanged = (currentEnemy: Enemy | undefined) => {
    if (currentEnemy !== undefined) {
      this.master.person.setTarget(currentEnemy.person);
      currentEnemy.person.setTarget(this.master.person);
    } else {
      this.master.person.setTarget(undefined);
    }
  };

  private controlMasterDeath = (isDeath: boolean) => {
    if (isDeath) {
      events.emit(EventKeys.Core.MasterDeath, this.master, this.enemy);

      this.stopBattle();
      this.master.deathPenalty();
      this.master.person.refreshHp();
    }
  };

  private controlEnemyDeath = (isDeath: boolean) => {
    if (isDeath) {
      // if enemy death trigger enemy death event
      // continue battle current active enemy
      events.emit(EventKeys.Core.EnemyDeath, this.enemy);

      this.stopBattle();
      this.createActiveEnemy();
      this.startBattle();
    }
  };

  private createActiveEnemy = () => {
    if (this.activeEnemyItem === undefined) {
      BattleControl.logger.error(`Try to create active enemy with undefined item`, this);
      throw new Error(`Try to create active enemy with undefined item`);
    }

    this.enemy = new Enemy(this.activeEnemyItem);
    this.events.emit(BattleControlEventKeys.EnemyChanged, this.enemy);
  };

  private clearEnemy = () => {
    this.enemy = undefined;
    this.events.emit(BattleControlEventKeys.EnemyChanged, this.enemy);
  };
}

export { BattleControl };

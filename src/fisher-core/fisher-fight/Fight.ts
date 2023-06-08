import { makeAutoObservable, reaction } from 'mobx';
import { EventEmitter } from 'smar-util';
import { prefixLogger, prefixes } from '@FisherLogger';
import { Enemy, Master } from '../fisher-person';

interface IFightInfo {
  master: Master;
  enemy: Enemy;
  isAttacking: boolean;
}

class Fight {
  private static readonly logger = prefixLogger(prefixes.FISHER_CORE, 'Fight');

  public static readonly EventKeys = {
    MasterWinFight: 'MasterWinFight',
    MasterLostFight: 'MasterLostFight',
  };

  private master: Master;

  private enemy: Enemy;

  public readonly event = new EventEmitter();

  public static create = (enemy: Enemy) => {
    const fight = new Fight(Master.create(), enemy);
    fight.setFightTargets();
    return fight;
  };

  public get info(): IFightInfo {
    return {
      master: this.master,
      enemy: this.enemy,
      isAttacking: this.enemy !== undefined && this.master.person.isAttacking,
    };
  }

  constructor(master: Master, enemy: Enemy) {
    makeAutoObservable(this);

    this.master = master;
    this.enemy = enemy;

    reaction<boolean>(() => this.enemy.Hp <= 0, this.controlEnemyDeath);
    reaction<boolean>(() => this.master.Hp <= 0, this.controlMasterDeath);
  }

  public stopFighting = () => {
    this.master.person.stopBattle();
    this.enemy.person.stopBattle();

    this.master.person.clearTarget();
    this.enemy.person.clearTarget();

    Fight.logger.info('stop fighting');
  };

  public startFighting = () => {
    this.master.person.startBattle();
    this.enemy.person.startBattle();

    Fight.logger.info('start fighting');
  };

  private setFightTargets = () => {
    this.master.person.setTarget(this.enemy.person);
    this.enemy.person.setTarget(this.master.person);

    Fight.logger.debug(`Success set fight target, current masdter target: ${this.enemy.name}`);
  };

  private controlEnemyDeath = (isDeath: boolean) => {
    if (isDeath) {
      Fight.logger.info(`Fight end, enemy ${this.enemy!.name} was death, emit ${Fight.EventKeys.MasterWinFight} event`);

      this.event.emit(Fight.EventKeys.MasterWinFight, this.master, this.enemy);
      this.stopFighting();
    }
  };

  private controlMasterDeath = (isDeath: boolean) => {
    if (isDeath) {
      Fight.logger.info(`Fight end, master was death, emit ${Fight.EventKeys.MasterLostFight} event`);

      this.event.emit(Fight.EventKeys.MasterLostFight, this.master, this.enemy);
      this.stopFighting();
    }
  };
}

export { Fight };

import { makeAutoObservable, reaction } from 'mobx';
import { EventEmitter } from 'smar-util';
import { prefixLogger, prefixes } from '@FisherLogger';
import { Enemy, Master } from '../fisher-person';
import { FisherFightError } from '../fisher-error';

interface IFightInfo {
  master: Master;
  enemy: Enemy | undefined;
  isAttacking: boolean;
}

class Fight {
  private static readonly logger = prefixLogger(prefixes.FISHER_CORE, 'Fight');

  public static readonly EventKeys = {
    MasterWinFight: 'MasterWinFight',
    MasterLostFight: 'MasterLostFight',
  };

  private readonly master: Master = Master.create();

  private enemy: Enemy | undefined = undefined;

  public readonly event = new EventEmitter();

  public get info(): IFightInfo {
    return {
      master: this.master,
      enemy: this.enemy,
      isAttacking: this.enemy !== undefined && this.master.person.isAttacking,
    };
  }

  constructor() {
    makeAutoObservable(this);

    reaction<boolean>(() => this.enemy !== undefined && this.enemy.Hp <= 0, this.controlEnemyDeath);
    reaction<boolean>(() => this.master.Hp <= 0, this.controlMasterDeath);
  }

  public stopFighting = () => {
    if (this.enemy === undefined) {
      throw new FisherFightError('Please set enemy first', '请先设置战斗对象！');
    }

    this.master.person.stopBattle();
    this.enemy.person.stopBattle();

    this.master.person.clearTarget();
    this.enemy.person.clearTarget();

    Fight.logger.info('stop fighting');
  };

  public startFighting = (enemy: Enemy) => {
    if (this.enemy !== undefined) {
      this.stopFighting();
    }

    this.setEnemy(enemy);
    this.setFightTargets();

    this.master.person.startBattle();
    this.enemy!.person.startBattle();

    Fight.logger.info('start fighting');
  };

  private setFightTargets = () => {
    if (this.enemy === undefined) {
      throw new FisherFightError('Please set enemy first', '请先设置战斗对象！');
    }

    this.master.person.setTarget(this.enemy.person);
    this.enemy.person.setTarget(this.master.person);
    Fight.logger.debug(`Success set fight target, current masdter target: ${this.enemy.name}`);
  };

  private controlEnemyDeath = (isDeath: boolean) => {
    if (isDeath) {
      Fight.logger.info(`Fight end, enemy ${this.enemy!.name} was death, emit ${Fight.EventKeys.MasterWinFight} event`);

      this.stopFighting();
      this.event.emit(Fight.EventKeys.MasterWinFight, this.master, this.enemy);
    }
  };

  private controlMasterDeath = (isDeath: boolean) => {
    if (isDeath) {
      Fight.logger.info(`Fight end, master was death, emit ${Fight.EventKeys.MasterLostFight} event`);

      this.stopFighting();
      this.event.emit(Fight.EventKeys.MasterLostFight, this.master, this.enemy);
    }
  };

  private setEnemy = (enemy: Enemy) => {
    this.enemy = enemy;
  };
}

export { Fight };

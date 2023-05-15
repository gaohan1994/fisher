import { makeAutoObservable, reaction } from 'mobx';
import { EventEmitter } from 'smar-util';
import { prefixLogger, prefixes } from '@FisherLogger';
import { Enemy, Master } from '../fisher-person';

interface IOnFightEndOptions {
  winner: Master | Enemy;
  loser: Master | Enemy;
  isMasterWin: boolean;
}

interface IFightInfo {
  master: Master;
  enemy: Enemy | undefined;
  isAttacking: boolean;
}

class Fight {
  private static readonly logger = prefixLogger(prefixes.FISHER_CORE, 'Fight');

  public static readonly EventKeys = {
    FightEnd: 'FightEnd',
  };

  private readonly master: Master;

  private readonly enemy: Enemy | undefined = undefined;

  public readonly event = new EventEmitter();

  public get info(): IFightInfo {
    return {
      master: this.master,
      enemy: this.enemy,
      isAttacking: this.master.person.isAttacking,
    };
  }

  constructor() {
    makeAutoObservable(this);
    this.master = Master.create();

    reaction<boolean>(() => this.enemy !== undefined && this.enemy.Hp <= 0, this.controlEnemyDeath);
    reaction<boolean>(() => this.master.Hp <= 0, this.controlMasterDeath);
  }

  public stopFighting = () => {
    this.master.person.stopBattle();
    this.enemy.person.stopBattle();
    Fight.logger.info('stop fighting');
  };

  public startFighting = () => {
    this.setFightTargets();
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
      this.stopFighting();
      this.event.emit(Fight.EventKeys.FightEnd, {
        winner: this.master,
        loser: this.enemy,
        isMasterWin: true,
      } as IOnFightEndOptions);

      Fight.logger.info(`Fight end, enemy ${this.enemy.name} was death, emit ${Fight.EventKeys.FightEnd} event`);
    }
  };

  private controlMasterDeath = (isDeath: boolean) => {
    if (isDeath) {
      this.stopFighting();
      this.event.emit(Fight.EventKeys.FightEnd, {
        winner: this.enemy,
        loser: this.master,
        isMasterWin: false,
      } as IOnFightEndOptions);

      Fight.logger.info(`Fight end, master was death, emit ${Fight.EventKeys.FightEnd} event`);
    }
  };
}

export { Fight };

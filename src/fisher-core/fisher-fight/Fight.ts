import { makeAutoObservable, reaction } from 'mobx';
import { prefixLogger, prefixes } from '@FisherLogger';
import { Enemy, Master } from '../fisher-person';

interface IOnFightEnd {
  (result: IOnFightEndOptions): void;
}

interface IOnFightEndOptions {
  winner: Master | Enemy;
  loser: Master | Enemy;
  isMasterWin: boolean;
}

class Fight {
  private static readonly logger = prefixLogger(prefixes.FISHER_CORE, 'Fight');

  public readonly master: Master;

  public readonly enemy: Enemy;

  private onFightEnd: IOnFightEnd;

  constructor(enemy: Enemy, onFightEnd: IOnFightEnd) {
    makeAutoObservable(this);
    this.master = Master.create();
    this.enemy = enemy;
    this.onFightEnd = onFightEnd;

    reaction<boolean>(() => this.enemy.Hp <= 0, this.controlEnemyDeath);
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
      this.onFightEnd({
        winner: this.master,
        loser: this.enemy,
        isMasterWin: true,
      });
    }
  };

  private controlMasterDeath = (isDeath: boolean) => {
    if (isDeath) {
      this.stopFighting();
      this.onFightEnd({
        winner: this.enemy,
        loser: this.master,
        isMasterWin: false,
      });
    }
  };
}

export { Fight };

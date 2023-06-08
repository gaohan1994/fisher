import { autorun, makeAutoObservable, reaction } from 'mobx';
import { EventEmitter } from 'smar-util';
import { prefixLogger, prefixes } from '@FisherLogger';
import { Enemy, Master } from '../fisher-person';
import { fakeClock } from '../fisher-timer';

let fakeFightId = 0;

type FakeTimerId = ReturnType<typeof fakeClock.clock.setInterval>;

class FakeFight {
  public id = fakeFightId++;

  private static readonly logger = prefixLogger(prefixes.FISHER_CORE, 'FakeFight');

  public static readonly EventKeys = {
    MasterWinFight: 'MasterWinFight',
    MasterLostFight: 'MasterLostFight',
  };

  private enemy: Enemy;

  private timers = new Set<FakeTimerId>();

  private master: Master;

  private fightEndToken = false;

  private fakeFightTick = 0;

  private fakeFightDuration = 0;

  public readonly event = new EventEmitter();

  public static create = (master: Master, enemy: Enemy) => {
    const fight = new FakeFight(master, enemy);
    fight.setFightTargets();
    return fight;
  };

  constructor(master: Master, enemy: Enemy) {
    makeAutoObservable(this);

    this.master = master;
    this.enemy = enemy;
    this.configuraFakeFight();

    const disposers = [
      reaction<boolean>(() => this.enemy.Hp <= 0, this.controlEnemyDeath),
      reaction<boolean>(() => this.master.Hp <= 0, this.controlMasterDeath),
      autorun(async () => {
        do {
          await this.tickFakeFight();
        } while (!this.fightEndToken);

        disposers.forEach((disposer) => disposer());
      }),
    ];
  }

  public tickFakeFight = async () => {
    await fakeClock.clock.tickAsync(this.fakeFightTick);
    this.fakeFightDuration += this.fakeFightTick;

    FakeFight.logger.debug(`Fake fight tick duration ${this.fakeFightTick}`);
  };

  private configuraFakeFight = () => {
    this.setFightTargets();

    const [masterAttackSpeed, enemyAttackSpeed] = [
      this.master.attributePanel.AttackSpeed,
      this.enemy.attributePanel.AttackSpeed,
    ];

    this.timers.add(
      fakeClock.clock.setInterval(() => this.master.actionManager.attackActionHandler(), masterAttackSpeed)
    );
    this.timers.add(
      fakeClock.clock.setInterval(() => this.enemy.actionManager.attackActionHandler(), enemyAttackSpeed)
    );

    this.fakeFightTick = Math.max(masterAttackSpeed, enemyAttackSpeed);
  };

  private setFightTargets = () => {
    this.master.person.setTarget(this.enemy.person);
    this.enemy.person.setTarget(this.master.person);
  };

  private controlEnemyDeath = (isDeath: boolean) => {
    if (isDeath) {
      this.endFakeFight();
      this.event.emit(FakeFight.EventKeys.MasterWinFight, this.id, this.master, this.enemy, this.fakeFightDuration);

      FakeFight.logger.debug(
        `Fight end, enemy ${this.enemy!.name} was death, emit ${FakeFight.EventKeys.MasterWinFight} event`
      );
    }
  };

  private controlMasterDeath = (isDeath: boolean) => {
    if (isDeath) {
      this.endFakeFight();
      this.event.emit(FakeFight.EventKeys.MasterLostFight, this.id, this.master, this.enemy, this.fakeFightDuration);

      FakeFight.logger.debug(`Fight end, master was death, emit ${FakeFight.EventKeys.MasterLostFight} event`);
    }
  };

  private endFakeFight = () => {
    this.setFightEndToken();
    this.clearTargets();
    this.timers.forEach(fakeClock.clock.clearInterval as (id: FakeTimerId) => void);

    FakeFight.logger.debug(`End fake fight ${this.id}`);
  };

  private clearTargets = () => {
    this.master.person.clearTarget();
    this.enemy.person.clearTarget();
  };

  private setFightEndToken = () => {
    this.fightEndToken = true;
  };
}

export { FakeFight };

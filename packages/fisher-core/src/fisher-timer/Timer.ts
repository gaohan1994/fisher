import { makeAutoObservable } from 'mobx';
import { prefixLogger, prefixes } from '@fisher/logger';

type ITimer = ReturnType<typeof setInterval>;

interface ITimerAction {
  (): void;
}

interface ITimerOptions {
  showProgress?: boolean;
  fireImmediately?: boolean;
}

enum TimerMode {
  Normal,
  Progress,
}

export class Timer {
  static readonly logger = prefixLogger(prefixes.FISHER_CORE, 'Timer');
  /**
   * 当前进度 progress
   * 经过 Tick ms 增加一次进度
   * 进度 >= 100 时触发一次 action
   * 则每次进度增量 progressIncrement = (100 * Timer.Tick) / this.actionInterval
   *
   * @static
   * @memberof Timer
   */
  public static readonly Tick = 100;

  public id: string;

  public active = false;

  private action: ITimerAction;

  public timerId: ITimer | undefined = undefined;

  private actionInterval: number | undefined = undefined;

  private fireImmediately = false;

  private mode = TimerMode.Normal;

  private get isNormalMode() {
    return this.mode === TimerMode.Normal;
  }

  private get isProgressMode() {
    return this.mode === TimerMode.Progress;
  }

  private get progressIncrement() {
    if (this.actionInterval === undefined) return 0;
    return (100 * Timer.Tick) / this.actionInterval;
  }

  public progress = 0;

  constructor(id: string, action: ITimerAction, options?: ITimerOptions) {
    makeAutoObservable(this);

    this.id = 'Timer:' + id;
    this.action = action;

    if (options?.fireImmediately) {
      this.fireImmediately = options.fireImmediately;
    }

    if (options?.showProgress) {
      this.mode = TimerMode.Progress;
    }
  }

  public stopTimer = () => {
    this.setTimerInActive();
    this.timerControl();
  };

  public startTimer = (actionInterval: number) => {
    this.setActionInterval(actionInterval);
    this.setTimerActive();
    this.timerControl();
  };

  private timerControl = () => {
    if (this.isProgressMode) {
      return this.progressTimerActiveControl();
    }

    if (this.isNormalMode) {
      return this.normalTimerActiveControl();
    }

    Timer.logger.error('Unhandle timer mode');
  };

  private normalTimerActiveControl = () => {
    if (this.active) {
      this.timerId && clearInterval(this.timerId);
      this.timerId = setInterval(() => this.action(), this.actionInterval);

      this.fireImmediatelyActionHandler();
    } else {
      this.timerId && clearInterval(this.timerId);
    }
  };

  private progressTimerActiveControl = () => {
    if (this.active) {
      this.timerId && clearInterval(this.timerId);
      this.timerId = setInterval(() => this.nextProgress(), Timer.Tick);

      this.fireImmediatelyActionHandler();
    } else {
      this.resetProgress();
      this.timerId && clearInterval(this.timerId);
    }
  };

  private nextProgress = () => {
    this.progress += this.progressIncrement;
    this.tryTriggerAction();
  };

  public resetProgress = () => {
    if (!this.isProgressMode) {
      return Timer.logger.error('Try to reset progress not in a progress timer');
    }

    this.progress = 0;
  };

  private tryTriggerAction = () => {
    if (this.progress >= 100) {
      this.action();
      this.resetProgress();
    }
  };

  private fireImmediatelyActionHandler = () => {
    if (this.fireImmediately) {
      this.action();
    }
  };

  private setActionInterval = (actionInterval: number) => {
    this.actionInterval = actionInterval;
  };

  private setTimerActive = () => {
    this.active = true;
  };

  private setTimerInActive = () => {
    this.active = false;
  };
}

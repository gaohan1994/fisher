import { autorun, makeAutoObservable } from 'mobx';

type Timer = ReturnType<typeof setTimeout>;

interface IFisherTimerAction {
  (): void;
}

interface IFisherTimerOptions {
  /**
   * 是否立即执行一次
   * 默认开启
   * @type {boolean}
   * @memberof IFisherTimer
   */
  fireImmediately?: boolean;

  /**
   * 是否执行一次即销毁
   *
   * @type {boolean}
   * @memberof IFisherTimerOptions
   */
  once?: boolean;
}

/**
 * Fisher计时器
 * - 每隔 x ms 间隔执行一次action
 * - 当卸载的时候清除计时器
 *
 * @export
 * @class FisherTimer
 */
export class FisherTimer {
  public id: string;

  public timerId: Timer | undefined = undefined;

  public active = false;

  public action: IFisherTimerAction;

  public actionInterval?: number;

  public fireImmediately: boolean;

  public once: boolean;

  constructor(
    id: string,
    action: IFisherTimerAction,
    { fireImmediately, once }: IFisherTimerOptions = {}
  ) {
    makeAutoObservable(this);
    this.id = 'FisherTimer:' + (id ?? 'DefaultTimer');
    this.fireImmediately = fireImmediately ?? true;
    this.once = once ?? false;
    this.action = this.once
      ? () => {
          this.stopTimer();
          action();
        }
      : action;
    autorun(() => this.timerActive());
  }

  /**
   * 停止计时器任务
   *
   * @memberof FisherTimer
   */
  public stopTimer = () => {
    this.active = false;
  };

  /**
   * 开始执行计时器任务
   *
   * @param {boolean} isActive
   * @memberof FisherTimer
   */
  public startTimer = (actionInterval: number) => {
    this.actionInterval = actionInterval;
    this.active = true;
  };

  /**
   * 如果当前 timer 处于激活状态则执行 action
   * 如果当前 timer 处于未激活状态则清空 timer
   */
  private timerActive = () => {
    if (this.active) {
      this.timerId && clearInterval(this.timerId);
      this.timerId = setInterval(() => this.action(), this.actionInterval);
      this.fireImmediately && this.action();
    } else {
      this.timerId && clearInterval(this.timerId);
    }
  };
}

import { makeAutoObservable, reaction } from 'mobx';

type Timer = ReturnType<typeof setTimeout>;

interface IFisherTimerAction {
  (): void;
}

interface IFisherTimer {
  /**
   * 计时器要执行的action
   *
   * @type {IFisherTimerAction}
   * @memberof IFisherTimer
   */
  action: IFisherTimerAction;
  /**
   * 是否立即执行一次
   * 默认开启
   * @type {boolean}
   * @memberof IFisherTimer
   */
  fireImmediately?: boolean;
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
  public timerId?: Timer;
  public active = false;
  public action: IFisherTimerAction;
  public actionInterval?: number;
  public fireImmediately: boolean;

  constructor({ action, fireImmediately }: IFisherTimer) {
    makeAutoObservable(this);
    this.action = action;
    this.fireImmediately = fireImmediately ?? true;
    reaction(() => this.active, this.timerActiveReaction);
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
   * 如果当前timer处于激活状态则执行action
   * 如果当前timer处于未激活状态则清空timer
   *
   * @private
   * @param {boolean} isActive
   * @memberof FisherTimer
   */
  private timerActiveReaction = (isActive: boolean) => {
    if (isActive) {
      this.timerId && clearInterval(this.timerId);
      this.timerId = setInterval(() => this.action(), this.actionInterval);
      this.fireImmediately && this.action();
    } else {
      this.timerId && clearInterval(this.timerId);
    }
  };
}

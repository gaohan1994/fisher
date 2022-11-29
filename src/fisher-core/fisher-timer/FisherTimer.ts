import { makeAutoObservable, reaction } from 'mobx';

interface IFisherTimerAction {
  (): void;
}

interface IFisherTimer {
  action: IFisherTimerAction;
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
  public timerId?: number;
  public action: IFisherTimerAction;
  public actionInterval?: number;
  public active = false;

  constructor({ action }: IFisherTimer) {
    makeAutoObservable(this);
    this.action = action;
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
    } else {
      this.timerId && clearInterval(this.timerId);
    }
  };
}

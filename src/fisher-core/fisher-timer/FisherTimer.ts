import { makeAutoObservable } from 'mobx';

type Timer = ReturnType<typeof setTimeout>;

interface IFisherTimerAction {
  (): void;
}

interface IFisherTimerOptions {
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
  public static readonly DefaultInterval: number = 1000;

  public id: string;

  public timerId: Timer | undefined = undefined;

  public once: boolean = false;

  public action: IFisherTimerAction = () => {};

  constructor(
    id: string,
    action: IFisherTimerAction,
    { once }: IFisherTimerOptions = {}
  ) {
    this.id = 'FisherTimer:' + (id ?? 'DefaultTimer');
    this.once = once ?? false;
    this.action = this.once
      ? () => {
          this.stopTimer();
          action();
        }
      : action;
  }

  /**
   * 停止计时器任务
   *
   * @memberof FisherTimer
   */
  public stopTimer = () => {
    this.timerId && clearInterval(this.timerId);
  };

  /**
   * 开始执行计时器任务
   *
   * @param {number} actionInterval
   * @memberof FisherTimer
   */
  public startTimer = (actionInterval: number) => {
    this.timerId && clearInterval(this.timerId);
    this.timerId = setInterval(
      () => this.action(),
      actionInterval ?? FisherTimer.DefaultInterval
    );
  };
}

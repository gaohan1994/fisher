import { makeAutoObservable, reaction } from 'mobx';

type Timer = ReturnType<typeof setTimeout>;

const FisherTimerProgressInterval = 300;
const FisherTimerProgressThreshold = 100;

interface IFisherTimerAction {
  (): void;
}

interface IFisherTimer {
  id?: string;
  /**
   * 计时器要执行的action
   *
   * @type {IFisherTimerAction}
   * @memberof IFisherTimer
   */
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
  public id: string;
  public timerId?: Timer;
  public active = false;
  public action: IFisherTimerAction;

  /**
   * 每次执行任务需要的间隔
   *
   * @type {number}
   * @memberof FisherTimer
   */
  public actionInterval?: number;

  /**
   * @param {progress} 任务进度，进度大于等于间隔的时候执行任务
   * 0 - 100
   *
   * @param {progressIncrement} 进度增量
   *
   * @type {number}
   * @memberof FisherTimer
   */
  public progress: number = 0;
  public progressIncrement: number = 0;

  constructor({ id, action }: IFisherTimer) {
    makeAutoObservable(this);
    this.id = 'FisherTimer:' + (id ?? 'DefaultTimer');
    this.action = action;
    reaction(() => this.active, this.timerActiveReaction);
    reaction(() => this.progress, this.triggerAction);
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
    this.resetProgress();
    this.actionInterval = actionInterval;
    this.progressIncrement =
      (FisherTimerProgressThreshold * FisherTimerProgressInterval) /
      actionInterval;
    this.active = true;
  };

  public nextProgress = () => {
    this.progress += this.progressIncrement;
  };

  public resetProgress = () => {
    this.progress = 0;
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
      this.timerId = setInterval(
        () => this.nextProgress(),
        FisherTimerProgressInterval
      );
    } else {
      this.timerId && clearInterval(this.timerId);
    }
  };

  private triggerAction = (currentProgress: number) => {
    if (currentProgress > FisherTimerProgressThreshold) {
      this.action();
      this.resetProgress();
    }
  };
}

import invariant from 'invariant';
import { IReactionDisposer, makeAutoObservable, reaction } from 'mobx';
import { prefixLogger, prefixes } from '@FisherLogger';

const logger = prefixLogger(prefixes.FISHER_CORE, 'ActionControl');

interface IActionControl {
  actionId: string;
  onActionStart: () => void;
  onActionStop: () => void;
}

/**
 * action 开关
 * 当全局 activeActionId 等于当前 action id 时触发 start 回调，否则触发 stop 回调
 *
 *
 * @export
 * @class ActionControl
 * @extends {FisherBase}
 */
export class ActionControl {
  public actionId: string;
  public onActionStart: () => void;
  public onActionStop: () => void;
  public disposes: IReactionDisposer[] = [];

  constructor({ actionId, onActionStart, onActionStop }: IActionControl) {
    makeAutoObservable(this);

    invariant(
      !!actionId,
      'Fail to initialize ActionControl please set actionId'
    );
    this.actionId = actionId;

    invariant(
      typeof onActionStart === 'function',
      'Fail to initialize ActionControl please set onActionStart'
    );
    this.onActionStart = onActionStart;

    invariant(
      typeof onActionStop === 'function',
      'Fail to initialize ActionControl please set onActionStop'
    );
    this.onActionStop = onActionStop;

    const actionControlDispose = reaction(
      () => fisher.activeActionId === this.actionId,
      this._actionControlMethod
    );

    this.disposes.push(actionControlDispose);
  }

  public setActionActive = () => {
    fisher.setActiveActionId(this.actionId);
  };

  public setActionInActive = () => {
    fisher.setActiveActionId('');
  };

  private _actionControlMethod = (isCurrentActionActive: boolean) => {
    if (isCurrentActionActive) {
      logger.info(`Action ${this.actionId} start!`);
      this.onActionStart();
    } else {
      logger.info(`Action ${this.actionId} stop!`);
      this.onActionStop();
    }
  };
}

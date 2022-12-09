import invariant from 'invariant';
import { IReactionDisposer, makeAutoObservable, reaction } from 'mobx';
import { prefixLogger, prefixes } from '@FisherLogger';

const logger = prefixLogger(prefixes.FISHER_CORE, 'ActionControl');

interface FisherActionControlComponent {
  id: string;
  startAction: () => void;
  stopAction: () => void;
}

/**
 * action 开关
 * 当全局 activeActionId 等于当前 action id 时触发 start 回调，否则触发 stop 回调
 *
 * @export
 * @class ActionControl
 * @template T
 */
export class ActionControl<T extends FisherActionControlComponent> {
  public actionId: string;
  public controller: T;
  public disposes: IReactionDisposer[] = [];

  constructor(controller: T) {
    makeAutoObservable(this);

    invariant(
      !!controller,
      'Fail to initialize ActionControl please set actionId'
    );
    this.controller = controller;
    this.actionId = controller.id;

    invariant(
      typeof controller.startAction === 'function',
      'Fail to initialize ActionControl please set startAction'
    );
    invariant(
      typeof controller.stopAction === 'function',
      'Fail to initialize ActionControl please set stopAction'
    );

    const actionControlDispose = reaction(
      () => fisher.activeActionId === this.actionId,
      this._actionControlMethod
    );

    this.disposes.push(actionControlDispose);
  }

  public dispose = () => {
    this.disposes.forEach((disposeCallback) => disposeCallback());
  };

  public setActionActive = () => {
    fisher.setActiveActionId(this.actionId);
  };

  public setActionInActive = () => {
    fisher.setActiveActionId('');
  };

  private _actionControlMethod = (isCurrentActionActive: boolean) => {
    if (isCurrentActionActive) {
      logger.info(`Action ${this.actionId} start!`);
      this.controller.startAction();
    } else {
      logger.info(`Action ${this.actionId} stop!`);
      this.controller.stopAction();
    }
  };
}

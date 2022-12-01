import { IReactionDisposer } from 'mobx';

export class FisherBase {
  public disposes: IReactionDisposer[] = [];

  /**
   * 销毁监听函数
   *
   * @memberof Collection
   */
  public dispose = () => {
    this.disposes.forEach((disposeCallback) => disposeCallback());
  };
}

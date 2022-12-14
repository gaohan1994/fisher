import { makeAutoObservable } from 'mobx';
import invariant from 'invariant';
import { FisherEquipmentSlot } from '@FisherCore';
import {
  FisherPersonEquipmentManager,
  IFisherPersonRemoveEquipment,
  IFisherPersonUseEquipment,
} from './FisherPersonEquipmentManager';

/**
 * 人物类
 * 玩家和 NPC 都基于此类状态
 *
 * @export
 * @class FisherPerson
 */
export class FisherPerson {
  /**
   * 装备模块
   *
   * @type {FisherPersonEquipmentManager}
   * @memberof FisherPerson
   */
  public fisherPersonEquipmentManager: FisherPersonEquipmentManager;

  constructor() {
    makeAutoObservable(this);
    this.fisherPersonEquipmentManager = new FisherPersonEquipmentManager();
  }

  public get Helmet() {
    const result = this.fisherPersonEquipmentManager.equipmentMap.get(
      FisherEquipmentSlot.Helmet
    );
    invariant(result !== undefined, 'Fail get Helmet');
    return result;
  }

  public useEquipment: IFisherPersonUseEquipment = (...rest) => {
    this.fisherPersonEquipmentManager.useEquipment(...rest);
  };

  public removeEquipment: IFisherPersonRemoveEquipment = (...rest) => {
    this.fisherPersonEquipmentManager.removeEquipment(...rest);
  };
}

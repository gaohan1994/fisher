import { makeAutoObservable } from 'mobx';
import invariant from 'invariant';
import { prefixes, prefixLogger } from '@FisherLogger';
import { FisherEquipmentSlot } from '@FisherCore';
import {
  FisherPersonEquipmentManager,
  IFisherPersonRemoveEquipment,
  IFisherPersonUseEquipment,
} from './FisherPersonEquipmentManager';
import { AttributePanel } from './AttributePanel';
import { FisherPersonLevel, PersonLevel } from './fisher-person-level';

const logger = prefixLogger(prefixes.FISHER_CORE, 'FisherPerson');

interface IFisherPerson {
  id: string;
  name: string;
  level: PersonLevel;
}

/**
 * 人物类
 * 玩家和 NPC 都基于此类状态
 *
 * @export
 * @class FisherPerson
 */
export class FisherPerson {
  public id: string;
  public name: string;
  public personLevel: FisherPersonLevel;
  /**
   * 生命值
   *
   * @type {number}
   * @memberof FisherPerson
   */
  public Hp: number = Infinity;

  /**
   * 装备模块
   *
   * @type {FisherPersonEquipmentManager}
   * @memberof FisherPerson
   */
  public fisherPersonEquipmentManager: FisherPersonEquipmentManager;

  /**
   * 属性面板
   *
   * @type {AttributePanel}
   * @memberof FisherPerson
   */
  public attributePanel: AttributePanel;

  constructor({ id, name, level }: IFisherPerson) {
    makeAutoObservable(this);
    this.id = id;
    this.name = name;
    this.personLevel = new FisherPersonLevel({ level });
    this.fisherPersonEquipmentManager = new FisherPersonEquipmentManager();
    this.attributePanel = new AttributePanel(this);
  }

  public get Weapon() {
    const result = this.fisherPersonEquipmentManager.equipmentMap.get(
      FisherEquipmentSlot.Weapon
    );
    invariant(result !== undefined, 'Fail get Weapon');
    return result;
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

  /**
   * 初始化战斗属性
   *
   * @memberof FisherPerson
   */
  public initializeBattleAttributes = () => {
    this.Hp = Math.min(this.Hp, this.attributePanel.finalMaxHp);
  };

  /**
   * 人物死亡回调
   *
   * @memberof FisherPerson
   */
  public personDeath = () => {
    logger.info(`Person ${this.id} death`);
  };
}

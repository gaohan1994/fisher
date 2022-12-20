import { autorun, makeAutoObservable } from 'mobx';
import { IFisherPersonAttributesAffected } from './Attributes';
import { FisherPersonLevel } from './fisher-person-level';
import { FisherPersonEquipmentManager } from './FisherPersonEquipmentManager';

const BaseAttributeData = {
  MaxHp: 40,
  AttackPower: 4,
};

interface IAttributePanel {
  personLevel: FisherPersonLevel;
  fisherPersonEquipmentManager: FisherPersonEquipmentManager;
}

export class AttributePanel {
  public personLevel: FisherPersonLevel;
  public equipmentManager: FisherPersonEquipmentManager;

  /**
   * 人物基础属性
   * 受到人物等级系数的影响
   *
   * @type {IFisherPersonAttributesAffected}
   * @memberof AttributePanel
   */
  public baseAttributes: IFisherPersonAttributesAffected = {
    MaxHp: 0,
    AttackPower: 0,
  };

  constructor({ personLevel, fisherPersonEquipmentManager }: IAttributePanel) {
    makeAutoObservable(this);
    this.personLevel = personLevel;
    this.equipmentManager = fisherPersonEquipmentManager;
    autorun(() => this.calculateBaseAttributes());
  }

  /**
   * 生命值上限 = 基础生命值上限 + 装备加成生命值上限
   *
   * @readonly
   * @memberof AttributePanel
   */
  public get finalMaxHp() {
    return (
      this.baseAttributes.MaxHp +
      this.equipmentManager.equipmentAttributes.MaxHp
    );
  }

  /**
   * 最终攻击力
   * 人物基础攻击 * 人物基础攻击增幅 + 装备攻击力
   *
   * @readonly
   * @memberof AttributePanel
   */
  public get finalAttackPower() {
    return (
      this.baseAttributes.AttackPower +
      this.equipmentManager.equipmentAttributes.AttackPower
    );
  }

  /**
   * 基础属性计算公式
   * 属性 = 属性基础数据 x 人物等级系数
   *
   * @memberof AttributePanel
   */
  private calculateBaseAttributes = () => {
    this.baseAttributes = {
      MaxHp: this.personLevel.coefficient * BaseAttributeData.MaxHp,
      AttackPower: this.personLevel.coefficient * BaseAttributeData.AttackPower,
    };
  };
}

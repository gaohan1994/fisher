import { makeAutoObservable } from 'mobx';
import { IBonusEquipmentsAttributes } from './Attributes';
import { FisherPersonLevel } from './fisher-person-level';
import { FisherPersonEquipmentManager } from './FisherPersonEquipmentManager';

const BaseAttributeData = {
  BaseMaxHp: 40,
  BaseAttackPower: 4,
};

interface IAttributePanel {
  personLevel: FisherPersonLevel;
  personEquipmentManager: FisherPersonEquipmentManager;
}

export class AttributePanel {
  private personLevel: FisherPersonLevel;
  private equipmentManager: FisherPersonEquipmentManager;

  constructor({ personLevel, personEquipmentManager }: IAttributePanel) {
    makeAutoObservable(this);
    this.personLevel = personLevel;
    this.equipmentManager = personEquipmentManager;
  }

  /**
   * 装备属性
   *
   * @readonly
   * @memberof AttributePanel
   */
  public get BonusEquipmentsAttributes() {
    const result: IBonusEquipmentsAttributes = {
      MaxHp: 0,
      AttackPower: 0,
    };
    this.equipmentManager.equipments.map(({ equipment }) => {
      const { attributes } = equipment;
      attributes.length &&
        attributes.forEach(({ key, value }) => {
          result[key] += value;
        });
    });
    return result;
  }

  /**
   * 基础攻击力
   *
   * @readonly
   * @memberof AttributePanel
   */
  public get BaseAttackPower() {
    return this.personLevel.coefficient * BaseAttributeData.BaseAttackPower;
  }

  /**
   * 基础攻击力增幅
   * @todo 暂时为1
   *
   * @readonly
   * @memberof AttributePanel
   */
  public get BaseAttackPowerMultiplier() {
    return 1;
  }

  /**
   * 奖励攻击力 = 装备攻击力
   *
   * @readonly
   * @memberof AttributePanel
   */
  public get BonusAttackPower() {
    return this.BonusEquipmentsAttributes.AttackPower;
  }

  /**
   * 攻击力加成增幅
   * @todo 暂时为1
   *
   * @readonly
   * @memberof AttributePanel
   */
  public get BonusAttackPowerMultiplier() {
    return 1;
  }

  /**
   * 最终攻击力
   * (人物基础攻击 x 人物基础攻击增幅) +
   * (攻击力加成 x 攻击力加成增幅)
   *
   * @readonly
   * @memberof AttributePanel
   */
  public get AttackPower() {
    return (
      this.BaseAttackPower * this.BaseAttackPowerMultiplier +
      this.BonusAttackPower * this.BonusAttackPowerMultiplier
    );
  }

  /**
   * 攻击倍率
   * @todo 与护甲有关,暂时为1
   *
   * @readonly
   * @memberof AttributePanel
   */
  public get AttackDamageMultiplier() {
    return 1;
  }

  /**
   * 攻击伤害 = 最终攻击力 x 攻击伤害系数
   *
   * @readonly
   * @memberof AttributePanel
   */
  public get AttackDamage() {
    return this.AttackPower * this.AttackDamageMultiplier;
  }

  /**
   * 基础血量 = 等级系数 x 每级血量
   *
   * @readonly
   * @memberof AttributePanel
   */
  public get BaseMaxHp() {
    return this.personLevel.coefficient * BaseAttributeData.BaseMaxHp;
  }

  /**
   * 加成血量 = 装备血量
   *
   * @readonly
   * @memberof AttributePanel
   */
  public get BonusMaxHp() {
    return this.BonusEquipmentsAttributes.MaxHp;
  }

  /**
   * 生命值上限 = 基础生命值上限 + 装备生命值
   *
   * @readonly
   * @memberof AttributePanel
   */
  public get MaxHp() {
    return this.BaseMaxHp + this.BonusMaxHp;
  }
}

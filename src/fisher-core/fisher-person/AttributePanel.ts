import { makeAutoObservable } from 'mobx';
import { FisherPersonLevel } from './fisher-person-level';
import { FisherPersonEquipmentManager } from './FisherPersonEquipmentManager';

const BaseAttributeData = {
  BaseMaxHp: 40,
  BaseAttackPower: 4,
};

interface IAttributePanel {
  personLevel: FisherPersonLevel;
  fisherPersonEquipmentManager: FisherPersonEquipmentManager;
}

export class AttributePanel {
  public personLevel: FisherPersonLevel;
  public equipmentManager: FisherPersonEquipmentManager;

  constructor({ personLevel, fisherPersonEquipmentManager }: IAttributePanel) {
    makeAutoObservable(this);
    this.personLevel = personLevel;
    this.equipmentManager = fisherPersonEquipmentManager;
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
   * 攻击力加成
   * - 装备加成
   *
   * @readonly
   * @memberof AttributePanel
   */
  public get BonusAttackPower() {
    return this.equipmentManager.equipmentAttributes.AttackPower;
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
   * 攻击伤害 = 最终攻击力 * 攻击伤害系数
   *
   * @readonly
   * @memberof AttributePanel
   */
  public get AttackDamage() {
    return this.AttackPower * this.AttackDamageMultiplier;
  }

  /**
   * 基础血量
   *
   * @readonly
   * @memberof AttributePanel
   */
  public get BaseMaxHp() {
    return this.personLevel.coefficient * BaseAttributeData.BaseMaxHp;
  }

  /**
   * 生命值上限 = 基础生命值上限 + 装备加成生命值上限
   *
   * @readonly
   * @memberof AttributePanel
   */
  public get MaxHp() {
    return this.BaseMaxHp + this.equipmentManager.equipmentAttributes.MaxHp;
  }
}

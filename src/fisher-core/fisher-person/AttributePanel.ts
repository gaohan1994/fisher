import { makeAutoObservable } from 'mobx';
import { IBonusEquipmentsAttributes } from './Attributes';
import { Person } from './Person';
import { PersonEquipmentManager } from './PersonEquipmentManager';
import { PersonLevelManager } from './PersonLevelManager';

const DefenceFormulaCoe = 0.06;

const BaseAttributeData = {
  BaseMaxHp: 40,
  BaseAttackPower: 4,
  BaseDefencePower: 2,
};

export class AttributePanel {
  private target?: Person;

  private personLevelManager: PersonLevelManager;

  private equipmentManager: PersonEquipmentManager;

  constructor(person: Person) {
    makeAutoObservable(this);
    this.target = person.target;
    this.personLevelManager = person.personLevelManager;
    this.equipmentManager = person.personEquipmentManager;
  }

  /**
   * 装备属性
   */
  public get BonusEquipmentsAttributes() {
    const result: IBonusEquipmentsAttributes = {
      MaxHp: 0,
      AttackPower: 0,
      AttackPowerMultiplier: 0,
      DefensePower: 0,
      DefensePowerMultiplier: 0,
      DefenceCorruption: 0,
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
   */
  public get BaseAttackPower() {
    return this.personLevelManager.coefficient * BaseAttributeData.BaseAttackPower;
  }

  /**
   * 基础攻击力增幅
   * @todo 暂时为1
   */
  public get BaseAttackPowerMultiplier() {
    return 1;
  }

  /**
   * 基础防御力
   */
  public get BaseDefencePower() {
    return this.personLevelManager.coefficient * BaseAttributeData.BaseDefencePower;
  }

  /**
   * 奖励攻击力 = 装备攻击力
   */
  public get BonusAttackPower() {
    return this.BonusEquipmentsAttributes.AttackPower;
  }

  /**
   * 攻击力加成百分比乘数
   * @todo 暂时为1
   */
  public get BonusAttackPowerMultiplier() {
    return 1 + this.BonusEquipmentsAttributes.AttackPowerMultiplier;
  }

  /**
   * 防御力加成
   */
  public get BonusDefencePower() {
    return this.BonusEquipmentsAttributes.DefensePower;
  }

  /**
   * 防御力加成百分比乘数
   */
  public get BonusDefencePowerMultiplier() {
    return 1 + this.BonusEquipmentsAttributes.DefensePowerMultiplier;
  }

  /**
   * 最终攻击力
   * (人物基础攻击 x 人物基础攻击增幅) +
   * (攻击力加成 x 攻击力加成增幅)
   */
  public get AttackPower() {
    return (
      this.BaseAttackPower * this.BaseAttackPowerMultiplier + this.BonusAttackPower * this.BonusAttackPowerMultiplier
    );
  }

  /**
   * 攻击系数
   * @todo 与目标护甲有关,暂时为1
   */
  public get AttackDamageMultiplier() {
    return 1 - (DefenceFormulaCoe * this.DefencePower) / (1 + DefenceFormulaCoe * Math.abs(this.DefencePower));
  }

  /**
   * 攻击伤害 = 最终攻击力 x 攻击伤害系数
   */
  public get AttackDamage() {
    return Math.floor(this.AttackPower * this.AttackDamageMultiplier);
  }

  /**
   * 攻速单位 ms
   */
  public get AttackSpeed() {
    return 2000;
  }

  /**
   * 防御力 = 基础防御力 + (加成防御力 x 加成防御力百分比乘数) - 对手减甲值
   */
  public get DefencePower() {
    return (
      this.BaseDefencePower +
      this.BonusDefencePower * this.BonusDefencePowerMultiplier -
      (this.target?.attributePanel.DefenceCorruption ?? 0)
    );
  }

  /**
   * 减甲 = 装备减甲
   */
  public get DefenceCorruption() {
    return this.BonusEquipmentsAttributes.DefenceCorruption;
  }

  /**
   * 基础血量 = 等级系数 x 每级血量
   */
  public get BaseMaxHp() {
    return this.personLevelManager.coefficient * BaseAttributeData.BaseMaxHp;
  }

  /**
   */
  public get BonusMaxHp() {
    return this.BonusEquipmentsAttributes.MaxHp;
  }

  /**
   * 生命值上限 = 基础生命值上限 + 装备生命值
   */
  public get MaxHp() {
    return this.BaseMaxHp + this.BonusMaxHp;
  }
}

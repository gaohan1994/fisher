import { makeAutoObservable } from 'mobx';
import { Experience } from '../fisher-experience';
import { Person } from './Person';
import { PersonEquipmentManager } from './PersonEquipmentManager';
import {
  IBonuesBuffAttributes,
  IBonusBuffAttributesKeys,
  IBonusEquipmentsAttributes,
  IBonusEquipmentsAttributesKeys,
} from './Attributes';
import { EquipmentSlot } from '../fisher-item';
import { ActionManager } from './ActionsManager';

const DefenceFormulaCoe = 0.06;
const DefaultAttackSpeed = 2500;

enum BaseAttributeData {
  InitializeMaxHp = 500,
  BaseMaxHp = 20,
  BaseAttackPower = 2,
  BaseDefencePower = 0.5,
}

const emptyBonusAttributes: IBonusEquipmentsAttributes = {
  MaxHp: 0,
  AttackPower: 0,
  AttackPowerMultiplier: 0,
  DefencePower: 0,
  DefenceCorruption: 0,
  DefencePowerMultiplier: 0,
};

class AttributePanel {
  private target?: Person;

  private experience: Experience;

  private equipmentManager: PersonEquipmentManager;

  private actionManager: ActionManager;

  constructor(person: Person) {
    makeAutoObservable(this);

    this.target = person.target;
    this.experience = person.experience;
    this.equipmentManager = person.personEquipmentManager;
    this.actionManager = person.actionManager;
  }

  public get BonusEquipmentsAttributes() {
    const result: IBonusEquipmentsAttributes = Object.assign({}, emptyBonusAttributes);

    const equipmentAttributes = this.calculateEquipmentAttributes();
    const equipmentSetAttributes = this.calculateEquipmentSetAttributes();

    const keys = Object.keys(result);
    for (let index = 0; index < keys.length; index++) {
      const key = keys[index] as keyof IBonusEquipmentsAttributes;
      result[key] = equipmentAttributes[key] + equipmentSetAttributes[key];
    }

    return result;
  }

  private calculateEquipmentAttributes = (): IBonusEquipmentsAttributes => {
    const result: IBonusEquipmentsAttributes = Object.assign({}, emptyBonusAttributes);

    this.equipmentManager.equipments.map(({ equipment }) => {
      if (equipment !== undefined && equipment.attributes.length > 0) {
        equipment.attributes.forEach(({ key, value }) => (result[key as IBonusEquipmentsAttributesKeys] += value));
      }
    });

    return result;
  };

  private calculateEquipmentSetAttributes = (): IBonusEquipmentsAttributes => {
    const result: IBonusEquipmentsAttributes = Object.assign({}, emptyBonusAttributes);

    this.equipmentManager.equipmentSets.map((equipmentSet) => {
      equipmentSet.setAttributes.map(([setSlotControl, attributes]) => {
        if (setSlotControl.active === true) {
          attributes.forEach(({ key, value }) => (result[key as IBonusEquipmentsAttributesKeys] += value));
        }
      });
    });

    return result;
  };

  public get BonusBuffStatusAttributes(): IBonuesBuffAttributes {
    const result: IBonuesBuffAttributes = Object.assign({}, emptyBonusAttributes);

    const buffAttributes = this.calculateBuffAttributes();
    const debuffAttributes = this.calculateDebuffAttributes();

    const keys = Object.keys(result);
    for (let index = 0; index < keys.length; index++) {
      const key = keys[index] as keyof IBonuesBuffAttributes;
      result[key] = buffAttributes[key] + debuffAttributes[key];
    }

    return result;
  }

  private calculateBuffAttributes = (): IBonuesBuffAttributes => {
    const result: IBonuesBuffAttributes = Object.assign({}, emptyBonusAttributes);

    this.actionManager.activeBuffActions.forEach((activeBuff) => {
      activeBuff.values.forEach(({ key, value }) => (result[key as IBonusBuffAttributesKeys] += value));
    });

    return result;
  };

  private calculateDebuffAttributes = (): IBonuesBuffAttributes => {
    const result: IBonuesBuffAttributes = Object.assign({}, emptyBonusAttributes);

    this.actionManager.activeDebuffActions.forEach((activeDebuff) => {
      activeDebuff.values.forEach(({ key, value }) => (result[key as IBonusBuffAttributesKeys] += value));
    });

    return result;
  };

  public get BaseAttackPower() {
    return this.experience.level * BaseAttributeData.BaseAttackPower;
  }

  /**
   * 基础攻击力增幅
   */
  public get BaseAttackPowerMultiplier() {
    return 1;
  }

  public get BaseDefencePower() {
    return this.experience.level * BaseAttributeData.BaseDefencePower;
  }

  /**
   * 增益攻击力 = 装备加成攻击力 + buff加成攻击力
   *
   * @author Harper.Gao
   * @readonly
   * @memberof AttributePanel
   */
  public get BonusAttackPower() {
    return this.BonusEquipmentsAttributes.AttackPower + this.BonusBuffStatusAttributes.AttackPower;
  }

  /**
   * 增益攻击系数 = 1 + 装备攻击系数 + buff攻击系数
   *
   * @author Harper.Gao
   * @readonly
   * @memberof AttributePanel
   */
  public get BonusAttackPowerMultiplier() {
    return (
      1 + this.BonusEquipmentsAttributes.AttackPowerMultiplier + this.BonusBuffStatusAttributes.AttackPowerMultiplier
    );
  }

  /**
   * 增益防御力 = 装备防御力 + buff防御力
   *
   * @author Harper.Gao
   * @readonly
   * @memberof AttributePanel
   */
  public get BonusDefencePower() {
    return this.BonusEquipmentsAttributes.DefencePower + this.BonusBuffStatusAttributes.DefencePower;
  }

  /**
   * 增益防御系数 = 装备防御系数 + buff防御系数
   *
   * @author Harper.Gao
   * @readonly
   * @memberof AttributePanel
   */
  public get BonusDefencePowerMultiplier() {
    return (
      1 + this.BonusEquipmentsAttributes.DefencePowerMultiplier + this.BonusBuffStatusAttributes.DefencePowerMultiplier
    );
  }

  public get AttackPower() {
    return (
      this.BaseAttackPower * this.BaseAttackPowerMultiplier + this.BonusAttackPower * this.BonusAttackPowerMultiplier
    );
  }

  public get AttackDamageMultiplier() {
    return 1 - (DefenceFormulaCoe * this.DefencePower) / (1 + DefenceFormulaCoe * Math.abs(this.DefencePower));
  }

  public get AttackDamage() {
    return Math.floor(this.AttackPower * this.AttackDamageMultiplier);
  }

  /**
   * return the smaller attack speed of primary and secondary weapons
   *
   *
   * @readonly
   * @memberof AttributePanel
   */
  public get WeaponAttackSpeed() {
    const primaryWeapon = this.equipmentManager.equipmentMap.get(EquipmentSlot.PrimaryWeapon)!;
    const primaryWeaponAttackSpeed = !primaryWeapon.isEmpty ? primaryWeapon.equipment?.attackSpeed : undefined;

    const secondaryWeapon = this.equipmentManager.equipmentMap.get(EquipmentSlot.SecondaryWeapon)!;
    const secondaryWeaponAttackSpeed = !secondaryWeapon.isEmpty ? secondaryWeapon.equipment?.attackSpeed : undefined;

    if (primaryWeaponAttackSpeed === undefined && secondaryWeaponAttackSpeed === undefined) {
      return undefined;
    }

    if (primaryWeaponAttackSpeed !== undefined && secondaryWeaponAttackSpeed !== undefined) {
      return Math.min(primaryWeaponAttackSpeed, secondaryWeaponAttackSpeed);
    }

    return primaryWeaponAttackSpeed || secondaryWeaponAttackSpeed;
  }

  public get AttackSpeed() {
    let baseAttackSpeed = DefaultAttackSpeed;

    if (this.WeaponAttackSpeed !== undefined) {
      baseAttackSpeed = this.WeaponAttackSpeed;
    }

    return baseAttackSpeed;
  }

  public get DefencePower() {
    return (
      this.BaseDefencePower +
      this.BonusDefencePower * this.BonusDefencePowerMultiplier -
      (this.target?.attributePanel.DefenceCorruption ?? 0)
    );
  }

  /**
   * 减甲 = 装备减甲 + 增益减甲
   *
   * @author Harper.Gao
   * @readonly
   * @memberof AttributePanel
   */
  public get DefenceCorruption() {
    return this.BonusEquipmentsAttributes.DefenceCorruption + this.BonusBuffStatusAttributes.DefenceCorruption;
  }

  public get BaseMaxHp() {
    return BaseAttributeData.InitializeMaxHp + this.experience.level * BaseAttributeData.BaseMaxHp;
  }

  /**
   * 增益生命值上限 = 装备生命值上限 + buff生命值上限
   *
   * @author Harper.Gao
   * @readonly
   * @memberof AttributePanel
   */
  public get BonusMaxHp() {
    return this.BonusEquipmentsAttributes.MaxHp + this.BonusBuffStatusAttributes.MaxHp;
  }

  public get MaxHp() {
    return this.BaseMaxHp + this.BonusMaxHp;
  }
}

export { AttributePanel, BaseAttributeData };

import { makeAutoObservable } from 'mobx';
import { Experience } from '../fisher-experience';
import { Person } from './Person';
import { PersonEquipmentManager } from './PersonEquipmentManager';
import { IBonusEquipmentsAttributes, IBonusEquipmentsAttributesKeys } from './Attributes';

const DefenceFormulaCoe = 0.06;

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

export class AttributePanel {
  private target?: Person;
  private experience: Experience;
  private equipmentManager: PersonEquipmentManager;

  constructor(person: Person) {
    makeAutoObservable(this);
    this.target = person.target;
    this.experience = person.experience;
    this.equipmentManager = person.personEquipmentManager;
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

  public get BaseAttackPower() {
    return this.experience.level * BaseAttributeData.BaseAttackPower;
  }

  /**
   * 基础攻击力增幅
   * @todo 暂时为1
   */
  public get BaseAttackPowerMultiplier() {
    return 1;
  }

  public get BaseDefencePower() {
    return this.experience.level * BaseAttributeData.BaseDefencePower;
  }

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

  public get BonusDefencePower() {
    return this.BonusEquipmentsAttributes.DefencePower;
  }

  public get BonusDefencePowerMultiplier() {
    return 1 + this.BonusEquipmentsAttributes.DefencePowerMultiplier;
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
   * Unit: ms
   */
  public get AttackSpeed() {
    return 2000;
  }

  public get DefencePower() {
    return (
      this.BaseDefencePower +
      this.BonusDefencePower * this.BonusDefencePowerMultiplier -
      (this.target?.attributePanel.DefenceCorruption ?? 0)
    );
  }

  public get DefenceCorruption() {
    return this.BonusEquipmentsAttributes.DefenceCorruption;
  }

  public get BaseMaxHp() {
    return BaseAttributeData.InitializeMaxHp + this.experience.level * BaseAttributeData.BaseMaxHp;
  }

  public get BonusMaxHp() {
    return this.BonusEquipmentsAttributes.MaxHp;
  }

  public get MaxHp() {
    return this.BaseMaxHp + this.BonusMaxHp;
  }
}

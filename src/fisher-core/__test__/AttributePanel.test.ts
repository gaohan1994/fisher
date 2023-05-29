import { beforeEach, describe, expect, test } from 'vitest';
import { FisherCore } from '../fisher-core';
import { EquipmentSlot, IEquipmentItem } from '../fisher-item';
import { IAttributeKeys, Person } from '../fisher-person';
import { PersonMode, getPersonFactorConfig } from '../fisher-person/Constants';
import { AttributePanel } from '../fisher-person/AttributePanel';

let core: FisherCore;
beforeEach(() => {
  core = FisherCore.create();
});

const equip1: IEquipmentItem = {
  id: 'TestEquip1',
  name: '测试装备1',
  desc: '',
  media: '',
  price: 5,
  slot: EquipmentSlot.Helmet,
  requirements: [],
  attributes: [
    { key: IAttributeKeys.MaxHp, value: 20 },
    { key: IAttributeKeys.DefencePower, value: 5 },
    { key: IAttributeKeys.DefencePowerMultiplier, value: 0.05 },
  ],
};

const equip2: IEquipmentItem = {
  id: 'TestEquip2',
  name: '测试装备2',
  desc: '',
  media: '',
  price: 5,
  slot: EquipmentSlot.PrimaryWeapon,
  requirements: [],
  attributes: [
    { key: IAttributeKeys.AttackPower, value: 10 },
    { key: IAttributeKeys.AttackPowerMultiplier, value: 0.01 },
  ],
};

describe('PersonFactorConfig', () => {
  test('should success return person factor config', () => {
    expect(getPersonFactorConfig(PersonMode.Master)).toStrictEqual({
      DefenceFormulaFactor: 0.06,
      DefaultAttackSpeed: 2500,
      InitializeMaxHp: 500,
      HpFactor: 20,
      AttackPowerFactor: 2,
      DefencePowerFactor: 0.5,
    });

    expect(getPersonFactorConfig(PersonMode.CommonEnemy)).toStrictEqual({
      DefenceFormulaFactor: 0.06,
      DefaultAttackSpeed: 2500,
      InitializeMaxHp: 500,
      HpFactor: 20,
      AttackPowerFactor: 2,
      DefencePowerFactor: 0.5,
    });

    expect(getPersonFactorConfig(PersonMode.EliteEnemy)).toStrictEqual({
      DefenceFormulaFactor: 0.06,
      DefaultAttackSpeed: 2000,
      InitializeMaxHp: 5000,
      HpFactor: 20,
      AttackPowerFactor: 3,
      DefencePowerFactor: 1,
    });

    expect(getPersonFactorConfig(PersonMode.LegendaryEnemy)).toStrictEqual({
      DefenceFormulaFactor: 0.06,
      DefaultAttackSpeed: 2000,
      InitializeMaxHp: 20000,
      HpFactor: 50,
      AttackPowerFactor: 4,
      DefencePowerFactor: 3,
    });
  });
});

describe('AttributePanel', () => {
  test('should success create AttributePanel', () => {
    const person = new Person(PersonMode.Master);
    person.personEquipmentManager.clearEquipments();
    const attributePanel = new AttributePanel(person, getPersonFactorConfig(person.mode));

    const emptyBonuesAttributes = {
      MaxHp: 0,
      AttackPower: 0,
      AttackPowerMultiplier: 0,
      DefencePower: 0,
      DefenceCorruption: 0,
      DefencePowerMultiplier: 0,
    };

    expect(attributePanel.BonusEquipmentsAttributes).toStrictEqual(emptyBonuesAttributes);
    expect(attributePanel.BonusBuffStatusAttributes).toStrictEqual(emptyBonuesAttributes);
  });
});

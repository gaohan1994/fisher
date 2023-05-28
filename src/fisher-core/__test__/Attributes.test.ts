import { beforeEach, describe, expect, test } from 'vitest';
import { FisherCore } from '../fisher-core';
import { EquipmentItem, EquipmentSlot, IEquipmentItem } from '../fisher-item';
import { IAttributeKeys, Master, Person } from '../fisher-person';
import { BaseAttributeData } from '../fisher-person/AttributePanel';
import { PersonMode } from '../fisher-person/Constants';

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

describe('Person Attribute', () => {
  test('should calculate base attributes', () => {
    const master = Master.create();

    expect(master.attributePanel.BaseMaxHp).toBe(
      BaseAttributeData.InitializeMaxHp + BaseAttributeData.BaseMaxHp * master.level
    );
    expect(master.attributePanel.BaseAttackPower).toBe(BaseAttributeData.BaseAttackPower * master.level);
    expect(master.attributePanel.BaseDefencePower).toBe(BaseAttributeData.BaseDefencePower * master.level);
  });

  describe('should calculate bonus equipments attributes', () => {
    test('should calculate bonus equipment attributes both equipment attributes and equipment set attributes', () => {
      const person = new Person(PersonMode.Enemy);

      const [equipmentItem1, equipmentItem2] = [new EquipmentItem(equip1), new EquipmentItem(equip2)];
      person.personEquipmentManager.useEquipment(equipmentItem1);
      person.personEquipmentManager.useEquipment(equipmentItem2);

      expect(person.attributePanel.BonusEquipmentsAttributes.MaxHp).toBe(20);
      expect(person.attributePanel.BonusEquipmentsAttributes.AttackPower).toBe(10);
      expect(person.attributePanel.BonusEquipmentsAttributes.AttackPowerMultiplier).toBe(0.01);
      expect(person.attributePanel.BonusEquipmentsAttributes.DefencePower).toBe(5);
      expect(person.attributePanel.BonusEquipmentsAttributes.DefenceCorruption).toBe(0);
      expect(person.attributePanel.BonusEquipmentsAttributes.DefencePowerMultiplier).toBe(0.05);
    });

    test('should calculate bonus equipment attributes both equipment attributes and equipment set attributes', () => {
      const person = new Person(PersonMode.Enemy);

      const [equipWithSet1, equipWithSet2] = [
        Object.assign({}, equip1, { id: 'WoodSword', equipmentSetId: 'NoobSet' }),
        Object.assign({}, equip2, { id: 'ClothHat', equipmentSetId: 'NoobSet' }),
      ];
      const [equipmentItem1, equipmentItem2] = [new EquipmentItem(equipWithSet1), new EquipmentItem(equipWithSet2)];

      person.personEquipmentManager.useEquipment(equipmentItem1);
      person.personEquipmentManager.useEquipment(equipmentItem2);

      const equipmentSetMaxHp = 100;
      const equipmentSetAtackPower = 10;

      expect(person.attributePanel.BonusEquipmentsAttributes.MaxHp).toBe(20 + equipmentSetMaxHp);
      expect(person.attributePanel.BonusEquipmentsAttributes.AttackPower).toBe(10 + equipmentSetAtackPower);
    });
  });

  test('should calculate bonus attributes', () => {
    const master = Master.create();

    const equipmentItem1 = new EquipmentItem(equip1);
    master.personEquipmentManager.useEquipment(equipmentItem1);

    const equipmentItem2 = new EquipmentItem(equip2);
    master.personEquipmentManager.useEquipment(equipmentItem2);

    expect(master.attributePanel.BonusMaxHp).toBe(20);

    expect(master.attributePanel.BonusAttackPower).toBe(10);
    expect(master.attributePanel.BonusAttackPowerMultiplier).toBe(1 + 0.01);

    expect(master.attributePanel.BonusDefencePower).toBe(5);
    expect(master.attributePanel.BonusDefencePowerMultiplier).toBe(1 + 0.05);

    expect(master.attributePanel.DefenceCorruption).toBe(0);
  });

  test('should calculate attributes after count base and bonus', () => {
    const master = Master.create();

    const equipmentItem1 = new EquipmentItem(equip1);
    master.personEquipmentManager.useEquipment(equipmentItem1);

    const equipmentItem2 = new EquipmentItem(equip2);
    master.personEquipmentManager.useEquipment(equipmentItem2);

    const { attributePanel } = master;

    expect(attributePanel.MaxHp).toBe(520 + 20);
    expect(attributePanel.AttackPower).toBe((2 + 10) * 1.01);
    expect(attributePanel.DefencePower).toBe((0.5 + 5) * 1.05);
  });

  test('should success calculate AttackSpeed', () => {
    const person = new Person(PersonMode.Enemy);

    const withoutAttackSpeedPrimaryWeaponItem = new EquipmentItem(equip2);
    const withoutAttackSpeedSecondaryWeaponItem = new EquipmentItem(
      Object.assign({}, equip2, { slot: EquipmentSlot.SecondaryWeapon })
    );
    person.personEquipmentManager.useEquipment(withoutAttackSpeedPrimaryWeaponItem);
    person.personEquipmentManager.useEquipment(withoutAttackSpeedSecondaryWeaponItem);
    expect(person.attributePanel.WeaponAttackSpeed).toBeUndefined();
    expect(person.attributePanel.AttackSpeed).toBe(2500);

    const attackSpeedSecondaryWeaponItem = new EquipmentItem(
      Object.assign({}, equip2, { slot: EquipmentSlot.SecondaryWeapon, attackSpeed: 1800 })
    );
    person.personEquipmentManager.useEquipment(attackSpeedSecondaryWeaponItem);
    expect(person.attributePanel.WeaponAttackSpeed).toEqual(1800);
    expect(person.attributePanel.AttackSpeed).toBe(1800);

    const attackSpeedPrimaryWeaponItem = new EquipmentItem(Object.assign({}, equip2, { attackSpeed: 1700 }));
    person.personEquipmentManager.useEquipment(attackSpeedPrimaryWeaponItem);
    expect(person.attributePanel.WeaponAttackSpeed).toEqual(1700);
    expect(person.attributePanel.AttackSpeed).toBe(1700);

    const lowerAttackSpeedPrimaryWeaponItem = new EquipmentItem(Object.assign({}, equip2, { attackSpeed: 2500 }));
    person.personEquipmentManager.useEquipment(lowerAttackSpeedPrimaryWeaponItem);
    expect(person.attributePanel.WeaponAttackSpeed).toEqual(1800);
    expect(person.attributePanel.AttackSpeed).toBe(1800);
  });
});

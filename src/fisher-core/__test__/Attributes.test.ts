import { describe, expect, test } from 'vitest';
import {
  EquipmentItem,
  EquipmentSlot,
  IEquipmentItem,
  PersonLevel,
} from '../fisher-item';
import { IAttributeKeys, Master } from '../fisher-person';

const equip1: IEquipmentItem = {
  id: 'TestEquip1',
  name: '测试装备1',
  desc: '',
  media: '',
  price: 5,
  slots: [EquipmentSlot.Helmet],
  requirements: [],
  attributes: [
    { key: IAttributeKeys.MaxHp, value: 20 },
    { key: IAttributeKeys.DefensePower, value: 5 },
    { key: IAttributeKeys.DefensePowerMultiplier, value: 0.05 },
  ],
};

const equip2: IEquipmentItem = {
  id: 'TestEquip2',
  name: '测试装备2',
  desc: '',
  media: '',
  price: 5,
  slots: [EquipmentSlot.Weapon],
  requirements: [],
  attributes: [
    { key: IAttributeKeys.AttackPower, value: 10 },
    { key: IAttributeKeys.AttackPowerMultiplier, value: 0.01 },
  ],
};

describe('Person Attribute', () => {
  test('should calculate base attributes', () => {
    const master = Master.create();
    master.initialize({ name: 'Test', level: PersonLevel.GasRefiningLater });

    expect(master.attributePanel.BaseMaxHp).toBe(120);

    expect(master.attributePanel.BaseAttackPower).toBe(12);
    expect(master.attributePanel.BaseAttackPowerMultiplier).toBe(1);

    expect(master.attributePanel.BaseDefencePower).toBe(6);
  });

  test('should calculate bonus attributes', () => {
    const master = Master.create();

    const equipmentItem1 = new EquipmentItem(equip1);
    master.useEquipment(EquipmentSlot.Helmet, equipmentItem1);

    const equipmentItem2 = new EquipmentItem(equip2);
    master.useEquipment(EquipmentSlot.Weapon, equipmentItem2);

    expect(master.attributePanel.BonusMaxHp).toBe(20);

    expect(master.attributePanel.BonusAttackPower).toBe(10);
    expect(master.attributePanel.BonusAttackPowerMultiplier).toBe(1 + 0.01);

    expect(master.attributePanel.BonusDefencePower).toBe(5);
    expect(master.attributePanel.BonusDefencePowerMultiplier).toBe(1 + 0.05);

    expect(master.attributePanel.DefenceCorruption).toBe(0);
  });

  test('should calculate attributes after count base and bonus', () => {
    const master = Master.create();
    master.initialize({ name: 'Test', level: PersonLevel.GasRefiningLater });

    const equipmentItem1 = new EquipmentItem(equip1);
    master.useEquipment(EquipmentSlot.Helmet, equipmentItem1);

    const equipmentItem2 = new EquipmentItem(equip2);
    master.useEquipment(EquipmentSlot.Weapon, equipmentItem2);

    const { attributePanel } = master;

    expect(attributePanel.MaxHp).toBe(120 + 20);

    expect(attributePanel.AttackPower).toBe(12 + 10 * 1.01);
    expect(attributePanel.AttackSpeed).toBe(2000);

    expect(attributePanel.DefencePower).toBe(6 + 5 * 1.05);
  });
});

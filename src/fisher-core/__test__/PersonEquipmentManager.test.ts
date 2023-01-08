/**
 * @vitest-environment jsdom
 */
import { describe, expect, test } from 'vitest';
import { EquipmentItem, EquipmentSlot, ItemType } from '../fisher-item';
import { PersonEquipmentManager } from '../fisher-person';

const testEquipmentData = {
  id: 'JadeCloudHairpin',
  name: '流云白玉簪',
  desc: '雕工上乘，玉质极佳，但不是什么法器',
  media: '',
  type: ItemType.Equipment,
  price: 5,
  slots: [EquipmentSlot.Helmet],
  requirements: [],
  attributes: [],
};

describe('PersonEquipmentManager', () => {
  test('should success initialize PersonEquipmentManager', () => {
    const personEquipmentManager = new PersonEquipmentManager();
    expect(personEquipmentManager.equipmentMap.size).toBeGreaterThan(0);
  });
});

describe('PersonEquipmentManager interfaces', () => {
  test('should fail to useEquipment', () => {
    const personEquipmentManager = new PersonEquipmentManager();
    const equip = new EquipmentItem(testEquipmentData);
    expect(() => personEquipmentManager.useEquipment('WrongSlotName' as EquipmentSlot, equip)).toThrow(
      'Fail to use equipment, can not match slot'
    );
  });

  test('should success useEquipment', () => {
    const personEquipmentManager = new PersonEquipmentManager();
    const equip = new EquipmentItem(testEquipmentData);
    personEquipmentManager.useEquipment(EquipmentSlot.Helmet, equip);
    expect(personEquipmentManager.equipmentMap.get(EquipmentSlot.Helmet)?.isEmpty).toBeFalsy();
    expect(personEquipmentManager.equipmentMap.get(EquipmentSlot.Helmet)?.equipment).toBe(equip);
  });
});
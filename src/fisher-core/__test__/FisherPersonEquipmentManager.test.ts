import { describe, expect, test, vi } from 'vitest';
import { FisherCore } from '../fisher-core';
import {
  FisherEquipmentItem,
  FisherEquipmentSlot,
  FisherItemType,
} from '../fisher-item';
import { FisherPersonEquipmentManager } from '../fisher-person';

const fisher = new FisherCore();
vi.stubGlobal('fisher', fisher);

const testEquipmentData = {
  id: 'JadeCloudHairpin',
  name: '流云白玉簪',
  desc: '雕工上乘，玉质极佳，但不是什么法器',
  media: '',
  type: FisherItemType.Equipment,
  price: 5,
  slots: [FisherEquipmentSlot.Helmet],
  requirements: [],
  attributes: [],
};

describe('FisherPersonEquipmentManager', () => {
  test('should success initialize FisherPersonEquipmentManager', () => {
    const fisherPersonEquipmentManager = new FisherPersonEquipmentManager();
    expect(fisherPersonEquipmentManager.equipmentMap.size).toBeGreaterThan(0);
  });
});

describe('FisherPersonEquipmentManager interfaces', () => {
  test('should fail to useEquipment', () => {
    const fisherPersonEquipmentManager = new FisherPersonEquipmentManager();
    const equip = new FisherEquipmentItem(testEquipmentData);
    expect(() =>
      fisherPersonEquipmentManager.useEquipment(
        'WrongSlotName' as FisherEquipmentSlot,
        equip
      )
    ).toThrow('Fail to use equipment, can not match slot');
  });

  test('should success useEquipment', () => {
    const fisherPersonEquipmentManager = new FisherPersonEquipmentManager();
    const equip = new FisherEquipmentItem(testEquipmentData);
    fisherPersonEquipmentManager.useEquipment(
      FisherEquipmentSlot.Helmet,
      equip
    );
    expect(
      fisherPersonEquipmentManager.equipmentMap.get(FisherEquipmentSlot.Helmet)
        ?.isEmpty
    ).toBeFalsy();
    expect(
      fisherPersonEquipmentManager.equipmentMap.get(FisherEquipmentSlot.Helmet)
        ?.equipment
    ).toBe(equip);
  });
});

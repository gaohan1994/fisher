/**
 * @vitest-environment jsdom
 */
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { FisherCore } from '../fisher-core';
import {
  FisherEquipmentItem,
  FisherEquipmentSlot,
  ItemType,
} from '../fisher-item';
import { createFisherStore } from '../fisher-packages';
import { PersonEquipmentManager } from '../fisher-person';

beforeEach(async () => {
  await createFisherStore();
});

const fisher = new FisherCore();
vi.stubGlobal('fisher', fisher);

const testEquipmentData = {
  id: 'JadeCloudHairpin',
  name: '流云白玉簪',
  desc: '雕工上乘，玉质极佳，但不是什么法器',
  media: '',
  type: ItemType.Equipment,
  price: 5,
  slots: [FisherEquipmentSlot.Helmet],
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
    const equip = new FisherEquipmentItem(testEquipmentData);
    expect(() =>
      personEquipmentManager.useEquipment(
        'WrongSlotName' as FisherEquipmentSlot,
        equip
      )
    ).toThrow('Fail to use equipment, can not match slot');
  });

  test('should success useEquipment', () => {
    const personEquipmentManager = new PersonEquipmentManager();
    const equip = new FisherEquipmentItem(testEquipmentData);
    personEquipmentManager.useEquipment(FisherEquipmentSlot.Helmet, equip);
    expect(
      personEquipmentManager.equipmentMap.get(FisherEquipmentSlot.Helmet)
        ?.isEmpty
    ).toBeFalsy();
    expect(
      personEquipmentManager.equipmentMap.get(FisherEquipmentSlot.Helmet)
        ?.equipment
    ).toBe(equip);
  });
});

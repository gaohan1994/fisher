import { beforeEach, describe, expect, test } from 'vitest';
import { EquipmentItem, EquipmentSlot } from '../fisher-item';
import { FisherCore } from '../fisher-core';

let core: FisherCore;
beforeEach(() => {
  core = FisherCore.create();
});

const testEquipmentData = {
  id: 'JadeCloudHairpin',
  name: '流云白玉簪',
  desc: '雕工上乘，玉质极佳，但不是什么法器',
  media: '',
  price: 5,
  slots: [EquipmentSlot.Helmet],
  requirements: [],
  attributes: [],
};

describe('EquipmentItem', () => {
  test('should new EquipmentItem class', () => {
    const equipmentItem = new EquipmentItem(testEquipmentData);
    expect(equipmentItem.id).toBe(testEquipmentData.id);
  });
});

import { describe, expect, test } from 'vitest';
import {
  FisherEquipmentItem,
  FisherEquipmentSlot,
  FisherItemType,
} from '../fisher-item';

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

describe('FisherEquipmentItem', () => {
  test('should new fisherEquipmentItem class', () => {
    const fisherEquipmentItem = new FisherEquipmentItem(testEquipmentData);
    expect(fisherEquipmentItem.id).toBe(testEquipmentData.id);
  });
});

import { describe, expect, test } from 'vitest';
import { EquipmentItem, EquipmentSlot } from '../fisher-item';

const testEquipmentData = {
  id: 'JadeCloudHairpin',
  name: '流云白玉簪',
  desc: '雕工上乘，玉质极佳，但不是什么法器',
  media: '',
  price: 5,
  slot: 'Helmet',
  requirements: [],
  attributes: [],
} as any;

describe('EquipmentItem', () => {
  test('should new EquipmentItem class', () => {
    const equipmentItem = new EquipmentItem(testEquipmentData);
    expect(equipmentItem.slot).toStrictEqual(EquipmentSlot.Helmet);
    expect(equipmentItem.hasAttributes).toBeFalsy();
    expect(equipmentItem.hasEquipmentSet).toBeFalsy();
  });

  test('should success calculate has equipment set and has attributes', () => {
    const testEquip = {
      id: 'WoodSword',
      name: '新手木剑',
      desc: '用寻常木头做的剑',
      media: 'woodsword',
      price: 4,
      slot: EquipmentSlot.Helmet,
      attributes: [{ key: 'AttackPower', value: 40 }],
      equipmentSetId: 'NoobSet',
    };
    const equipmentItem = new EquipmentItem(testEquip);
    expect(equipmentItem.slot).toStrictEqual(EquipmentSlot.Helmet);
    expect(equipmentItem.hasAttributes).toBeTruthy();
    expect(equipmentItem.hasEquipmentSet).toBeTruthy();
  });
});

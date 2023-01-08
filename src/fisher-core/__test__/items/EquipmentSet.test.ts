import { describe, expect, test } from 'vitest';
import { EquipmentSet, ItemType } from '../../fisher-item';
import { findEquipmentById } from '../../fisher-packages';

const testEquipmentSetData = {
  id: 'NoobSet',
  name: '新手套装',
  desc: '给新手用的套装，为新人保驾护航',
  media: '',
  slots: ['Weapon'],
  equipmentIds: ['WoodSword', 'ClothHat'],
  setAttributes: [
    {
      slot: 2,
      attributes: [
        { key: 'AttackPower', value: 10 },
        { key: 'MaxHp', value: 100 },
      ],
    },
  ],
};

describe('EquipmentSet', () => {
  test('should new equipment set item', () => {
    const equipmentSet = new EquipmentSet(testEquipmentSetData);
    expect(equipmentSet.type).toEqual(ItemType.EquipmentSet);

    expect(equipmentSet.equipmentIdSet.size).toBe(2);
    expect(equipmentSet.equipmentIdSet.has('WoodSword')).toBeTruthy();
    expect(equipmentSet.equipmentIdSet.has('ClothHat')).toBeTruthy();

    expect(equipmentSet.setAttributeMap.size).toBe(1);
    expect(equipmentSet.setAttributes.length).toBe(1);

    const [setSlotControl, setAttributes] = equipmentSet.setAttributes[0];
    expect(setSlotControl.slot).toEqual(2);
    expect(setSlotControl.active).toBeFalsy();
    expect(setAttributes.find((attr) => attr.key === 'AttackPower')?.value).toEqual(10);
    expect(setAttributes.find((attr) => attr.key === 'MaxHp')?.value).toEqual(100);
  });

  test('should success calculate equipment set slot active', () => {
    const equipmentSet = new EquipmentSet(testEquipmentSetData);
    const woodSword = findEquipmentById('WoodSword');
    const clothHat = findEquipmentById('ClothHat');

    equipmentSet.calculateEquipmentsActiveSetAttributes([woodSword, clothHat]);

    const [setSlotControl] = equipmentSet.setAttributes[0];
    expect(setSlotControl.active).toBeTruthy();
  });
});

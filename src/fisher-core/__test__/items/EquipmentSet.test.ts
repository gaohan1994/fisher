import { beforeEach, describe, expect, test } from 'vitest';
import { FisherCore } from '../../fisher-core';
import { EquipmentSetExtra, EquipmentSet, ItemType } from '../../fisher-item';
import { store } from '../../fisher-packages';

let core: FisherCore;
beforeEach(() => {
  core = FisherCore.create();
});

const testEquipmentSetData = {
  id: 'NoobSet',
  name: '新手套装',
  desc: '给新手用的套装，为新人保驾护航',
  media: '',
  slots: ['PrimaryWeapon'],
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
  extraAttributes: [{ key: 'DefencePower', value: 10 }],
};

describe('EquipmentSet', () => {
  test('should new equipment set item', () => {
    const equipmentSet = new EquipmentSet(testEquipmentSetData);
    expect(equipmentSet.type).toEqual(ItemType.EquipmentSet);

    expect(equipmentSet.equipmentIdSet.size).toBe(2);
    expect(equipmentSet.equipmentIds).toStrictEqual(['WoodSword', 'ClothHat']);
    expect(equipmentSet.equipmentIdSet.has('WoodSword')).toBeTruthy();
    expect(equipmentSet.equipmentIdSet.has('ClothHat')).toBeTruthy();

    expect(equipmentSet.setAttributeMap.size).toBe(1);
    expect(equipmentSet.setAttributes.length).toBe(1);

    const [setSlotControl, setAttributes] = equipmentSet.setAttributes[0];
    expect(setSlotControl.slot).toEqual(2);
    expect(setSlotControl.active).toBeFalsy();
    expect(setAttributes.find((attr) => attr.key === 'AttackPower')?.value).toEqual(10);
    expect(setAttributes.find((attr) => attr.key === 'MaxHp')?.value).toEqual(100);

    expect(equipmentSet.extra instanceof EquipmentSetExtra).toBeTruthy();
    expect(equipmentSet.hasExtraAttributes).toBeTruthy();
    expect(equipmentSet.extra?.setSlotControl.active).toBeFalsy();
    expect(equipmentSet.extra?.attributes.length).toEqual(1);

    expect(equipmentSet.extra?.attributes[0].key).toEqual('DefencePower');
    expect(equipmentSet.extra?.attributes[0].value).toEqual(10);
  });

  test('should success calculate equipment set slot active', () => {
    const equipmentSet = new EquipmentSet(testEquipmentSetData);
    const woodSword = store.findEquipmentById('WoodSword');
    const clothHat = store.findEquipmentById('ClothHat');

    test('should success calculate active equipments', () => {
      equipmentSet.calculateEquipmentsActiveSetAttributes([woodSword]);
      expect(equipmentSet.activeEquipmentLength).toBe(1);
      expect(equipmentSet.checkEquipmentIsActive(woodSword)).toBeTruthy();
      expect(equipmentSet.checkEquipmentIsActive(clothHat)).toBeFalsy();
    });

    test('should success calculate active attributes', () => {
      equipmentSet.calculateEquipmentsActiveSetAttributes([woodSword, clothHat]);
      const [setSlotControl] = equipmentSet.setAttributes[0];
      expect(setSlotControl.active).toBeTruthy();

      test('should success calculate equipment set extra attributes', () => {
        expect(equipmentSet.extra?.setSlotControl.active).toBeTruthy();
      });
    });
  });
});

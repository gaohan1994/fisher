/**
 * @vitest-environment jsdom
 */
import { describe, expect, test } from 'vitest';
import { Backpack } from '../fisher-backpack';
import { EquipmentItem, EquipmentSlot, ItemType } from '../fisher-item';
import { findEquipmentById, findEquipmentSetById } from '../fisher-packages';
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

describe('PersonEquipmentManager interfaces', () => {
  test('should fail to useEquipment', () => {
    const personEquipmentManager = new PersonEquipmentManager();
    const equip = new EquipmentItem(testEquipmentData);
    expect(() => personEquipmentManager.useEquipment('WrongSlotName' as EquipmentSlot, equip)).toThrow(
      `Fail to use equipment ${equip.id}, can not match slot, equipmentSlot`
    );
  });

  describe('shou success use equipment', () => {
    test('should success use equipment if previous equipment was empty', () => {
      const personEquipmentManager = new PersonEquipmentManager();
      const equip = new EquipmentItem(testEquipmentData);

      personEquipmentManager.useEquipment(EquipmentSlot.Helmet, equip);

      expect(personEquipmentManager.equipmentMap.get(EquipmentSlot.Helmet)?.isEmpty).toBeFalsy();
      expect(personEquipmentManager.equipmentMap.get(EquipmentSlot.Helmet)?.equipment).toBe(equip);
    });

    test('should success use equipment if previous equipment was not empty', () => {
      const personEquipmentManager = new PersonEquipmentManager();
      const equip = new EquipmentItem(testEquipmentData);

      personEquipmentManager.useEquipment(EquipmentSlot.Helmet, equip);

      test('should put previous equipment into backpack', () => {
        const backpack = Backpack.create();
        personEquipmentManager.useEquipment(EquipmentSlot.Helmet, equip);

        expect(backpack.items.has(equip)).toBeTruthy();
        expect(backpack.items.get(equip)?.item).toStrictEqual(equip);
        expect(backpack.items.get(equip)?.quantity).toBe(1);
      });
    });
  });

  describe('should calculate equipment set after update equipments', () => {
    const personEquipmentManager = new PersonEquipmentManager();

    const weapon = findEquipmentById('WoodSword');
    const helmet = findEquipmentById('ClothHat');

    test('should add NoobSet after use WoodSword', () => {
      personEquipmentManager.useEquipment(EquipmentSlot.Weapon, weapon);

      const noobSet = findEquipmentSetById('NoobSet');

      expect(personEquipmentManager.equipmentSetMap.size).toBe(1);
      expect(personEquipmentManager.equipmentSetMap.has(noobSet)).toBeTruthy();
      expect(noobSet.setAttributes[0][0].active).toBeFalsy();

      test('NoobSet work equipment should to be WoodSword', () => {
        expect(personEquipmentManager.equipmentSetMap.get(noobSet)?.length).toBe(1);
        expect(personEquipmentManager.equipmentSetMap.get(noobSet)?.[0]).toBe(weapon);
      });
    });

    test('should active NoobSet if use both WoodSword and ClothHat', () => {
      personEquipmentManager.useEquipment(EquipmentSlot.Weapon, weapon);
      personEquipmentManager.useEquipment(EquipmentSlot.Helmet, helmet);

      const noobSet = findEquipmentSetById('NoobSet');
      expect(noobSet.setAttributes[0][0].active).toBeTruthy();

      test('NoobSet work equipments should to be WoodSword and ClothHat', () => {
        expect(personEquipmentManager.equipmentSetMap.get(noobSet)?.length).toBe(1);
        expect(personEquipmentManager.equipmentSetMap.get(noobSet)?.[0]).toBe(weapon);
        expect(personEquipmentManager.equipmentSetMap.get(noobSet)?.[1]).toBe(helmet);
      });
    });
  });
});

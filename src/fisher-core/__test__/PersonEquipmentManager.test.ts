/**
 * @vitest-environment jsdom
 */
import { beforeEach, describe, expect, test } from 'vitest';
import { EquipmentItem, EquipmentSlot, IEquipmentItem } from '../fisher-item';
import { store } from '../fisher-packages';
import { Person, PersonEquipmentManager } from '../fisher-person';
import { FisherCore } from '../fisher-core';
import { PersonMode } from '../fisher-person/Constants';
import { ActionId } from '../fisher-actions';

let core: FisherCore;
beforeEach(() => {
  core = FisherCore.create();
  core.backpack.items.clear();
});

const testEquipmentData: IEquipmentItem = {
  id: 'JadeCloudHairpin',
  name: '流云白玉簪',
  desc: '雕工上乘，玉质极佳，但不是什么法器',
  media: '',
  price: 5,
  slot: EquipmentSlot.Helmet,
  requirements: [],
  attributes: [],
  actionIds: [ActionId.DragonSwordAction],
};

describe('PersonEquipmentManager interfaces', () => {
  test('should fail to useEquipment', () => {
    const personEquipmentManager = new PersonEquipmentManager();
    const equip = new EquipmentItem(Object.assign({}, testEquipmentData, { slot: 'WrongSlotName' }));
    expect(() => personEquipmentManager.useEquipment(equip)).toThrow(
      `Fail to use equipment, can not find current slot: WrongSlotName`
    );
  });

  describe('shou success use equipment', () => {
    test('should success use equipment if previous equipment was empty', () => {
      const person = new Person(PersonMode.CommonEnemy);
      const { personEquipmentManager } = person;
      const equip = new EquipmentItem(testEquipmentData);

      personEquipmentManager.useEquipment(equip);

      expect(personEquipmentManager.equipmentMap.get(EquipmentSlot.Helmet)?.isEmpty).toBeFalsy();
      expect(personEquipmentManager.equipmentMap.get(EquipmentSlot.Helmet)?.equipment).toBe(equip);
    });

    test('should success use equipment if previous equipment was not empty', () => {
      const { backpack, master } = core;

      const prevEquip = new EquipmentItem(Object.assign({}, testEquipmentData, { id: 'JadeCloudHairpin1' }));
      master.person.personEquipmentManager.useEquipment(prevEquip);

      const equip = new EquipmentItem(testEquipmentData);
      master.person.personEquipmentManager.useEquipment(equip);

      expect(backpack.items.has(prevEquip)).toBeTruthy();
      expect(backpack.items.get(prevEquip)?.item).toStrictEqual(prevEquip);
      expect(backpack.items.get(prevEquip)?.quantity).toBe(1);
    });

    test('should reduce backpack item when success use equipment', () => {
      const { backpack, master } = core;
      const { personEquipmentManager } = master;
      const equip = new EquipmentItem(testEquipmentData);

      backpack.addItem(equip, 1);
      expect(backpack.getItem(equip)?.quantity).toBe(1);

      personEquipmentManager.useEquipment(equip);
      expect(backpack.getItem(equip)).toBeUndefined();
    });
  });

  describe('should calculate equipment set after update equipments', () => {
    const personEquipmentManager = new PersonEquipmentManager();

    const weapon = store.findEquipmentById('WoodSword');
    const helmet = store.findEquipmentById('ClothHat');

    test('should add NoobSet after use WoodSword', () => {
      personEquipmentManager.useEquipment(weapon);

      const noobSet = store.findEquipmentSetById('NoobSet');

      expect(personEquipmentManager.equipmentSetMap.size).toBe(1);
      expect(personEquipmentManager.equipmentSetMap.has(noobSet)).toBeTruthy();
      expect(noobSet.setAttributes[0][0].active).toBeFalsy();

      test('NoobSet work equipment should to be WoodSword', () => {
        expect(personEquipmentManager.equipmentSetMap.get(noobSet)?.length).toBe(1);
        expect(personEquipmentManager.equipmentSetMap.get(noobSet)?.[0]).toBe(weapon);
      });
    });

    test('should active NoobSet if use both WoodSword and ClothHat', () => {
      personEquipmentManager.useEquipment(weapon);
      personEquipmentManager.useEquipment(helmet);

      const noobSet = store.findEquipmentSetById('NoobSet');
      expect(noobSet.setAttributes[0][0].active).toBeTruthy();

      test('NoobSet work equipments should to be WoodSword and ClothHat', () => {
        expect(personEquipmentManager.equipmentSetMap.get(noobSet)?.length).toBe(1);
        expect(personEquipmentManager.equipmentSetMap.get(noobSet)?.[0]).toBe(weapon);
        expect(personEquipmentManager.equipmentSetMap.get(noobSet)?.[1]).toBe(helmet);
      });
    });
  });

  test('should success calculate equipment action ids', () => {
    const personEquipmentManager = new PersonEquipmentManager();
    expect(personEquipmentManager.equipmentActionIds.length).toBe(0);

    personEquipmentManager.useEquipment(new EquipmentItem(testEquipmentData));

    expect(personEquipmentManager.equipmentActionIds).toStrictEqual([
      'LowBuffAttackPowerMultiplierAction',
      'DragonSwordAction',
    ]);
  });
});

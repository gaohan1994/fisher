/**
 * @vitest-environment jsdom
 */
import { describe, expect, test } from 'vitest';
import { EquipmentItem, EquipmentSlot } from '../fisher-item';
import { PersonEquipment } from '../fisher-person';

const emptyEquipment = new EquipmentItem({
  id: 'EmptyEquipment',
  name: '空',
  desc: '',
  media: '',
  price: 0,
  slots: [EquipmentSlot.Helmet, EquipmentSlot.Weapon],
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

describe('PersonEquipment', () => {
  test('should success initialize personEquipment', () => {
    const personEquipment = new PersonEquipment({
      slot: EquipmentSlot.Helmet,
    });
    expect(personEquipment.slot).toBe(EquipmentSlot.Helmet);
    expect(personEquipment.emptyEquipment).toStrictEqual(emptyEquipment);
    expect(personEquipment.equipment).toStrictEqual(emptyEquipment);
    expect(personEquipment.isEmpty).toBeTruthy();
  });

  test('should success update equipment if previos equipment was empty', () => {
    const personEquipment = new PersonEquipment({ slot: EquipmentSlot.Helmet });

    const previosIsEmpty = personEquipment.isEmpty;
    expect(previosIsEmpty).toBeTruthy();

    const equip = new EquipmentItem(testEquipmentData);
    const result = personEquipment.updateEquipment(equip, 2);

    expect(personEquipment.equipment).toBe(equip);
    expect(personEquipment.quantity).toBe(2);
    expect(personEquipment.isEmpty).toBeFalsy();

    test('should return undefined if previos equipment was empty', () => {
      expect(result).toBeUndefined();
    });
  });

  test('should success update equipment when prev equipment was not empty', () => {
    const personEquipment = new PersonEquipment({ slot: EquipmentSlot.Helmet });
    const equip = new EquipmentItem(testEquipmentData);
    personEquipment.updateEquipment(equip, 3);

    const result = personEquipment.updateEquipment(equip, 2);
    expect(personEquipment.equipment).toBe(equip);
    expect(personEquipment.quantity).toBe(2);

    test('should return undefined if previos equipment was empty', () => {
      expect(result?.[0]).toBe(equip);
      expect(result?.[1]).toBe(3);
    });
  });

  test('should fail to remove equipment when prev equipment was empty', () => {
    const personEquipment = new PersonEquipment({
      slot: EquipmentSlot.Helmet,
    });
    expect(() => personEquipment.removeEquipment()).toThrow(
      'Fail to remove equipment, current slot equipment was empty'
    );
  });

  test('should success to remove equipment when prev equipment was not empty', () => {
    const personEquipment = new PersonEquipment({ slot: EquipmentSlot.Helmet });
    const equip = new EquipmentItem(testEquipmentData);
    personEquipment.updateEquipment(equip, 1);
    const [previousEquipment, previousQuantity] = personEquipment.removeEquipment();

    expect(personEquipment.equipment).toStrictEqual(emptyEquipment);
    expect(personEquipment.quantity).toBe(0);

    test('should return previous equipment after remove equipment', () => {
      expect(previousEquipment).toBe(equip);
      expect(previousQuantity).toBe(1);
    });
  });
});

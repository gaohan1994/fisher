/**
 * @vitest-environment jsdom
 */
import { beforeEach, describe, expect, test } from 'vitest';
import { EmptyEquipment, EquipmentItem, EquipmentSlot } from '../fisher-item';
import { PersonEquipment } from '../fisher-person';
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
  slot: EquipmentSlot.Helmet,
  requirements: [],
  attributes: [],
};

describe('PersonEquipment', () => {
  test('should success initialize personEquipment', () => {
    const personEquipment = new PersonEquipment(EquipmentSlot.Helmet);
    expect(personEquipment.slot).toBe(EquipmentSlot.Helmet);
    expect(personEquipment.emptyEquipment).toStrictEqual(new EmptyEquipment(EquipmentSlot.Helmet));
    expect(personEquipment.equipment).toBeUndefined();
    expect(personEquipment.isEmpty).toBeTruthy();
  });

  test('should success update equipment if previos equipment was empty', () => {
    const personEquipment = new PersonEquipment(EquipmentSlot.Helmet);

    const previosIsEmpty = personEquipment.isEmpty;
    expect(previosIsEmpty).toBeTruthy();

    const equip = new EquipmentItem(testEquipmentData);
    const result = personEquipment.updateEquipment(equip);

    expect(personEquipment.equipment).toBe(equip);
    expect(personEquipment.isEmpty).toBeFalsy();

    test('should return undefined if previos equipment was empty', () => {
      expect(result).toBeUndefined();
    });
  });

  test('should success update equipment when prev equipment was not empty', () => {
    const personEquipment = new PersonEquipment(EquipmentSlot.Helmet);
    const equip = new EquipmentItem(testEquipmentData);
    personEquipment.updateEquipment(equip);

    const result = personEquipment.updateEquipment(equip);
    expect(personEquipment.equipment).toBe(equip);
    expect(result).toBe(equip);
  });

  test('should fail to remove equipment when prev equipment was empty', () => {
    const personEquipment = new PersonEquipment(EquipmentSlot.Helmet);
    expect(() => personEquipment.removeEquipment()).toThrow(
      'Fail to remove equipment, current slot equipment was empty'
    );
  });

  test('should success to remove equipment when prev equipment was not empty', () => {
    const personEquipment = new PersonEquipment(EquipmentSlot.Helmet);
    const equip = new EquipmentItem(testEquipmentData);
    personEquipment.updateEquipment(equip);
    const previousEquipment = personEquipment.removeEquipment();

    expect(personEquipment.equipment).toBeUndefined();
    expect(previousEquipment).toBe(equip);
  });
});

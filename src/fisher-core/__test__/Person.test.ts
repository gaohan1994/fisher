import { beforeEach, describe, expect, test } from 'vitest';
import { EquipmentSlot } from '../fisher-item';
import { master, Person, PersonEquipmentManager, ActionManager } from '../fisher-person';
import { AttributePanel } from '../fisher-person/AttributePanel';
import { FisherCore } from '../fisher-core';
import { PersonMode } from '../fisher-person/Constants';

let core: FisherCore;
beforeEach(() => {
  core = FisherCore.create();
});

describe('Person', () => {
  test('should success constructor Person', () => {
    const person = new Person(PersonMode.Enemy);
    expect(person.actionManager instanceof ActionManager).toBeTruthy();
    expect(person.personEquipmentManager instanceof PersonEquipmentManager).toBeTruthy();
    expect(person.personEquipmentManager.equipmentMap.has(EquipmentSlot.Helmet)).toBeTruthy();
    expect(person.attributePanel instanceof AttributePanel).toBeTruthy();
  });

  test('should initialize master', () => {
    expect(master.mode).toBe(PersonMode.Master);
  });
});

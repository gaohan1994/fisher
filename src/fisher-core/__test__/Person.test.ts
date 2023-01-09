import { beforeEach, describe, expect, test } from 'vitest';
import { EquipmentSlot } from '../fisher-item';
import { master, Person, PersonEquipmentManager, PersonLevelManager, ActionManager } from '../fisher-person';
import { AttributePanel } from '../fisher-person/AttributePanel';
import { FisherCore } from '../fisher-core';

let core: FisherCore;
beforeEach(() => {
  core = FisherCore.create();
});

describe('Person', () => {
  test('should success constructor Person', () => {
    const person = new Person();
    expect(person.mode).toBeUndefined();
    expect(person.initialized).toBeFalsy();
    expect(person.name).toBe('DefaultName');
    expect(person.actionManager instanceof ActionManager).toBeTruthy();
    expect(person.personLevelManager instanceof PersonLevelManager).toBeTruthy();
    expect(person.personEquipmentManager instanceof PersonEquipmentManager).toBeTruthy();
    expect(person.personEquipmentManager.equipmentMap.has(EquipmentSlot.Helmet)).toBeTruthy();
    expect(person.attributePanel instanceof AttributePanel).toBeTruthy();
  });

  test('should initialize master', () => {
    master.initialize({
      name: '玩家',
      level: Person.Level.GasRefiningEarly,
    });
    expect(master.name).toBe('玩家');
    expect(master.initialized).toBeTruthy();
    expect(master.mode).toBe(Person.Mode.Master);
    expect(master.personLevelManager.level).toBe(Person.Level.GasRefiningEarly);
    expect(master.personLevelManager.name).toBe('炼气前期');
  });
});

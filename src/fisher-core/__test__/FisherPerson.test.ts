import { describe, expect, test } from 'vitest';
import { FisherEquipmentSlot } from '../fisher-item';
import {
  master,
  FisherPerson,
  FisherPersonEquipmentManager,
  FisherPersonLevel,
} from '../fisher-person';
import { AttributePanel } from '../fisher-person/AttributePanel';
import { ActionManager } from '../fisher-person/person-actions';

describe('FisherPerson', () => {
  test('should success constructor FisherPerson', () => {
    const fisherPerson = new FisherPerson();
    expect(fisherPerson.mode).toBe('');
    expect(fisherPerson.initialized).toBeFalsy();
    expect(fisherPerson.name).toBe('DefaultName');
    expect(fisherPerson.actionManager instanceof ActionManager).toBeTruthy();
    expect(fisherPerson.personLevel instanceof FisherPersonLevel).toBeTruthy();
    expect(fisherPerson.personLevel.initialized).toBeFalsy();
    expect(
      fisherPerson.personEquipmentManager instanceof
        FisherPersonEquipmentManager
    ).toBeTruthy();
    expect(
      fisherPerson.personEquipmentManager.equipmentMap.has(
        FisherEquipmentSlot.Helmet
      )
    ).toBeTruthy();
    expect(fisherPerson.attributePanel instanceof AttributePanel).toBeTruthy();
  });

  test('should initialize master', () => {
    master.initialize({
      name: '玩家',
      level: FisherPerson.Level.GasRefiningEarly,
    });
    expect(master.name).toBe('玩家');
    expect(master.initialized).toBeTruthy();
    expect(master.mode).toBe(FisherPerson.Mode.Master);
    expect(master.personLevel.level).toBe(FisherPerson.Level.GasRefiningEarly);
    expect(master.personLevel.label).toBe('炼气前期');
  });

  test('should ', () => {});
});

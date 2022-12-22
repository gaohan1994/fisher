import { describe, expect, test, vi } from 'vitest';
import { FisherCore } from '../fisher-core';
import { FisherEquipmentSlot } from '../fisher-item';
import {
  FisherPerson,
  FisherPersonEquipmentManager,
  FisherPersonLevel,
} from '../fisher-person';
import { AttributePanel } from '../fisher-person/AttributePanel';

const fisher = new FisherCore();
vi.stubGlobal('fisher', fisher);

describe('FisherPerson', () => {
  test('should success constructor FisherPerson', () => {
    const fisherPerson = new FisherPerson();
    expect(fisherPerson.mode).toBeUndefined();
    expect(fisherPerson.initialized).toBeFalsy();
    expect(fisherPerson.name).toBe('DefaultName');
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

  test('should initialize person', () => {
    const master = new FisherPerson();
    master.initialize({
      mode: FisherPerson.Mode.Master,
      name: '玩家',
      level: FisherPerson.Level.GasRefiningEarly,
    });
    expect(master.name).toBe('玩家');
    expect(master.initialized).toBeTruthy();
    expect(master.mode).toBe(FisherPerson.Mode.Master);
    expect(master.personLevel.level).toBe(FisherPerson.Level.GasRefiningEarly);
    expect(master.personLevel.label).toBe('炼气前期');
  });
});

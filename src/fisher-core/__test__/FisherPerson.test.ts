import { describe, expect, test } from 'vitest';
import { FisherEquipmentSlot } from '../fisher-item';
import {
  master,
  Enemy,
  FisherPerson,
  FisherPersonEquipmentManager,
  FisherPersonLevel,
} from '../fisher-person';
import { AttributePanel } from '../fisher-person/AttributePanel';

describe('FisherPerson', () => {
  test('should success constructor FisherPerson', () => {
    const fisherPerson = new FisherPerson();
    expect(fisherPerson.mode).toBe('');
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

  test('should initialize enemy', () => {
    const enemy = new Enemy();
    enemy.initialize({
      name: '敌对',
      level: FisherPerson.Level.GasRefiningLater,
    });
    expect(enemy.name).toBe('敌对');
    expect(enemy.initialized).toBeTruthy();
    expect(enemy.mode).toBe(FisherPerson.Mode.Enemy);
    expect(enemy.personLevel.level).toBe(FisherPerson.Level.GasRefiningLater);
    expect(enemy.personLevel.label).toBe('炼气后期');
  });
});

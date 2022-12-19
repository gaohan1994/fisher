import { describe, expect, test, vi } from 'vitest';
import { FisherCore } from '../fisher-core';
import { FisherEquipmentSlot } from '../fisher-item';
import {
  PersonLevel,
  FisherPerson,
  FisherPersonEquipmentManager,
} from '../fisher-person';

const fisher = new FisherCore();
vi.stubGlobal('fisher', fisher);

describe('FisherPerson', () => {
  test('should success initialize FisherPerson', () => {
    const fisherPerson = new FisherPerson({
      id: 'TestFisherPerson',
      name: 'Harper Gao',
      level: PersonLevel.GasRefiningLater,
    });
    expect(
      fisherPerson.fisherPersonEquipmentManager instanceof
        FisherPersonEquipmentManager
    ).toBeTruthy();
    expect(
      fisherPerson.fisherPersonEquipmentManager.equipmentMap.has(
        FisherEquipmentSlot.Helmet
      )
    ).toBeTruthy();
  });

  test('should initialize master in global fisher', () => {
    expect(fisher.master instanceof FisherPerson).toBeTruthy();
  });
});

import { beforeEach, describe, expect, test } from 'vitest';
import { FisherCore, Backpack, Bank, Reiki, Person, Mining } from '@FisherCore';

let core: FisherCore;
beforeEach(() => {
  core = FisherCore.create();
});

describe('FisherCore', () => {
  test('should initialize FisherCore', () => {
    expect(core.backpack instanceof Backpack).toBeTruthy();
    expect(core.bank instanceof Bank).toBeTruthy();
    expect(core.mining instanceof Mining).toBeTruthy();
    expect(core.reiki instanceof Reiki).toBeTruthy();
    expect(core.master instanceof Person).toBeTruthy();

    expect(core.activeComponent).toBeUndefined();
    expect(core.activeComponentId).toBeUndefined();
  });
});

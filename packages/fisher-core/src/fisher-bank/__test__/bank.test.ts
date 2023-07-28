import { describe, expect, test } from 'vitest';
import { ComponentId } from '@shared';
import { events, EventKeys } from '@shared';
import { Core } from '../../fisher-core';
import { Bank } from '../Bank';

const core = new Core();
const bank = core.getService<Bank>(ComponentId.Bank);

beforeEach(() => {
  bank.clearGold();
});

describe('Should initialize Bank module', () => {
  test('should add gold', () => {
    expect(bank instanceof Bank).toBeTruthy();

    bank.receiveGold(50);
    expect(bank.gold).toBe(50);

    bank.receiveGold(11);
    expect(bank.gold).toBe(61);
  });

  test('should success listen ReceiveGold event', () => {
    events.emit(EventKeys.Bank.ReceiveGold, 100);
    expect(bank.gold).toBe(100);

    events.emit(EventKeys.Bank.ReceiveGold, 100);
    expect(bank.gold).toBe(200);
  });

  test('should success calculate gold is ready to pay', () => {
    expect(bank.checkGoldBalance(1)).toBeFalsy();
    bank.receiveGold(50);
    expect(bank.checkGoldBalance(1)).toBeTruthy();
  });
});

import { beforeEach, describe, expect, test } from 'vitest';
import { Bank } from '../fisher-bank';
import { FisherCore } from '../fisher-core';
import { EventKeys, events } from '../fisher-events';

let core: FisherCore;
let bank: Bank;
beforeEach(() => {
  core = FisherCore.create();
  bank = core.bank;
  bank.clearGold();
});

describe('Bank', () => {
  test('should add gold', () => {
    bank.receiveGold(50);
    expect(bank.gold).toBe(50);

    bank.receiveGold(11);
    expect(bank.gold).toBe(61);
  });

  describe('Bank events', () => {
    test('should success listen ReceiveGold event', () => {
      events.emit(EventKeys.Bank.ReceiveGold, 100);
      expect(bank.gold).toBe(100);

      events.emit(EventKeys.Bank.ReceiveGold, 100);
      expect(bank.gold).toBe(200);
    });
  });

  describe('Bank interface', () => {
    test('should success calculate gold is ready to pay', () => {
      expect(bank.checkGoldBalanceReadyToPay(1)).toBeFalsy();
      bank.receiveGold(50);
      expect(bank.checkGoldBalanceReadyToPay(1)).toBeTruthy();
    });
  });
});

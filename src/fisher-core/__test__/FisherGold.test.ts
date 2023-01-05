import { describe, expect, test } from 'vitest';
import { Bank } from '../fisher-bank';

describe('Bank', () => {
  test('initialize Bank without arguments, gold shoud tobe 0', () => {
    const bank = new Bank();
    expect(bank.gold).toBe(0);
  });

  test('should add gold', () => {
    const bank = new Bank();
    bank.receiveGold(50);
    expect(bank.gold).toBe(50);
  });
});

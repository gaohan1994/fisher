import { Bank } from '../Bank.js';

const bank = new Bank();

beforeEach(() => {
  bank.clearGold();
});

describe('Bank', () => {
  it('should add gold', () => {
    expect(bank.gold).toEqual(0);
    bank.receiveGold(50);
    expect(bank.gold).toEqual(50);
  });

  it('should set gold and reduce gold', () => {
    bank.setGold(100);
    expect(bank.gold).toEqual(100);
    bank.receiveGold(-50);
    expect(bank.gold).toEqual(50);
  });
});

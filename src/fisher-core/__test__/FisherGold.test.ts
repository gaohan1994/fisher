import { describe, expect, test } from 'vitest';
import { FisherGold } from '../fisher-gold';

describe('FisherGold', () => {
  test('initialize FisherGold without arguments, gold shoud tobe 0', () => {
    const fisherGold = new FisherGold({});
    expect(fisherGold.gold).toBe(0);
  });

  test('initialize FisherGold with arguments, gold shoud tobe number', () => {
    const fisherGold = new FisherGold({ gold: 100 });
    expect(fisherGold.gold).toBe(100);
  });

  test('should add gold', () => {
    const fisherGold = new FisherGold({});
    fisherGold.receiveGold(50);
    expect(fisherGold.gold).toBe(50);
  });

  test('should reduce gold', () => {
    const fisherGold = new FisherGold({ gold: 100 });
    fisherGold.receiveGold(-50);
    expect(fisherGold.gold).toBe(50);
  });
});

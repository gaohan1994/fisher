import { describe, expect, test, vi } from 'vitest';
import { FisherBattleEnemyItem, IFisherBattleEnemyItem } from '../fisher-item';
import { Enemy, FisherPerson, Master } from '../fisher-person';
import {
  ActionManager,
  ActionMode,
  NormalAttackAction,
} from '../fisher-person/person-actions';
import { FisherProgressTimer } from '../fisher-timer';

const testEnemyData = {
  id: 'LowSpritMonster',
  name: '水灵小妖',
  desc: '灵力较低的小妖怪，常出现在水源丰富的地界',
  media: '',
  level: 'GasRefiningEarly',
  goldReward: 1,
  itemRewards: [{ itemId: 'WaterReiki' }],
};

const battleEnemyItem = new FisherBattleEnemyItem(
  testEnemyData as IFisherBattleEnemyItem
);

describe('FisherPersonAction', () => {
  test('should initialize attack action', () => {
    const person1 = new FisherPerson();
    const person2 = new FisherPerson();
    person1.setTarget(person2);
    person2.setTarget(person1);
    const normalAttackAction = new NormalAttackAction(person1);
    expect(normalAttackAction.id).toBe('NormalAttackAction');
    expect(normalAttackAction.name).toBe('普通攻击');
    expect(normalAttackAction.mode).toBe(ActionMode.Attack);
    expect(
      normalAttackAction.timer instanceof FisherProgressTimer
    ).toBeTruthy();
  });

  test('should initialize action manager', async () => {
    vi.useFakeTimers();
    const person1 = new Master();
    person1.initialize({
      name: '玩家姓名',
      level: FisherPerson.Level.GasRefiningEarly,
    });
    const person2 = new Enemy('Test:EnemyId');
    await person2.initialize(battleEnemyItem);
    person1.setTarget(person2);
    person2.setTarget(person1);

    expect(person1.actionManager instanceof ActionManager).toBeTruthy();
    expect(person1.actionManager.actionMap.size).toBeGreaterThan(0);
    vi.clearAllTimers();
  });
});

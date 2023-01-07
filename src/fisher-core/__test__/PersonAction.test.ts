import { describe, expect, test, vi } from 'vitest';
import { EnemyItem, IEnemyItem, PersonLevel } from '../fisher-item';
import { Enemy, Person, Master } from '../fisher-person';
import { ActionManager, ActionMode, NormalAttackAction } from '../fisher-person/person-actions';

const testEnemyData: IEnemyItem = {
  id: 'LowSpritMonster',
  name: '水灵小妖',
  desc: '灵力较低的小妖怪，常出现在水源丰富的地界',
  media: '',
  level: PersonLevel.GasRefiningEarly,
  goldReward: 1,
  itemRewards: [{ itemId: 'WaterReiki' }],
};

const battleEnemyItem = new EnemyItem(testEnemyData);

describe('FisherPersonAction', () => {
  test('should initialize attack action', () => {
    const person1 = new Person();
    const person2 = new Person();
    person1.setTarget(person2);
    person2.setTarget(person1);
    const normalAttackAction = new NormalAttackAction(person1);
    expect(normalAttackAction.id).toBe('NormalAttackAction');
    expect(normalAttackAction.name).toBe('普通攻击');
    expect(normalAttackAction.mode).toBe(ActionMode.Attack);
  });

  test('should initialize action manager', async () => {
    vi.useFakeTimers();
    const person1 = new Master();
    person1.initialize({
      name: '玩家姓名',
      level: Person.Level.GasRefiningEarly,
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

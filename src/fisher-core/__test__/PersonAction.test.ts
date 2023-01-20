import { beforeEach, describe, expect, test, vi } from 'vitest';
import { ActionMode, NormalAttackAction } from '../fisher-actions';
import { EnemyItem, IEnemyItem } from '../fisher-item';
import { Enemy, Person, Master } from '../fisher-person';
import { FisherCore } from '../fisher-core';
import { Store } from '../fisher-packages';

let store: Store;
let core: FisherCore;
beforeEach(() => {
  store = Store.create();
  core = FisherCore.create();
});

const testEnemyData: IEnemyItem = {
  id: 'LowSpiritMonster',
  name: '水灵小妖',
  desc: '灵力较低的小妖怪，常出现在水源丰富的地界',
  media: '',
  level: 1,
  goldReward: 1,
  itemRewards: [{ itemId: 'WaterReiki' }],
};

const battleEnemyItem = new EnemyItem(testEnemyData);

describe('FisherPersonAction', () => {
  test('should initialize attack action', () => {
    const person1 = new Person('');
    const person2 = new Person('');
    person1.setTarget(person2);
    person2.setTarget(person1);
    const normalAttackAction = new NormalAttackAction();
    expect(normalAttackAction.id).toBe('NormalAttackAction');
    expect(normalAttackAction.name).toBe('普通攻击');
    expect(normalAttackAction.mode).toBe(ActionMode.Attack);
  });

  test('should initialize action manager', async () => {
    vi.useFakeTimers();
    const person1 = new Master();
    const person2 = new Enemy(battleEnemyItem);
    person1.person.setTarget(person2.person);
    person2.person.setTarget(person1.person);

    expect(person1.actionManager.dotActionMap.size).toBeGreaterThan(0);
    vi.clearAllTimers();
  });
});

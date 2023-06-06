import { beforeEach, describe, expect, test, vi } from 'vitest';
import { Backpack } from '../fisher-backpack';
import { Battle } from '../fisher-battle';
import { FisherCore } from '../fisher-core';
import { BackpackItem, EnemyItem, HealPotion } from '../fisher-item';
import { Person, PersonMode } from '../fisher-person';
import { PotionHandler } from '../fisher-potion';

let core: FisherCore;
let backpack: Backpack;
let battle: Battle;
beforeEach(() => {
  core = FisherCore.create();
  backpack = core.backpack;
  core.backpack.items.clear();
  battle = core.battle;
});

const healPotion = new HealPotion({
  id: 'LowHealPotion',
  name: '下品回灵丹',
  desc: '生命值恢复50点',
  media: 'LowHealPotion',
  price: 5,
  healValue: 5,
});

const enemy = new EnemyItem({
  id: 'Test:Potion:Enemy',
  name: '水灵小妖',
  desc: '灵力较低的小妖怪，常出现在水源丰富的地界',
  media: 'LowSpiritMonster',
  level: 1,
  goldReward: 1,
  itemRewards: [{ itemId: 'NormalReiki' }],
});

describe('Potion module', () => {
  test('Potion slot should success set', () => {
    const potionHandler = new PotionHandler();
    expect(potionHandler.hasPotion).toBeFalsy();
    expect(potionHandler.quantityAvailable).toBeFalsy();
    expect(potionHandler.potionAvailable).toBeFalsy();

    backpack.addItem(healPotion, 50);
    potionHandler.setPotion(backpack.getItem(healPotion)! as BackpackItem<HealPotion>);

    expect(potionHandler.potion).toStrictEqual(backpack.getItem(healPotion));
    expect(potionHandler.potionId).toEqual(healPotion.id);
    expect(potionHandler.hasPotion).toBeTruthy();
    expect(potionHandler.quantityAvailable).toBeTruthy();
    expect(potionHandler.potionAvailable).toBeTruthy();

    potionHandler.clearPotion();
    expect(potionHandler.hasPotion).toBeFalsy();
    expect(potionHandler.quantityAvailable).toBeFalsy();
    expect(potionHandler.potionAvailable).toBeFalsy();
  });

  test('should success use potion', () => {
    const healPotionHandler = new PotionHandler();
    backpack.addItem(healPotion, 50);
    healPotionHandler.setPotion(backpack.getItem(healPotion)! as BackpackItem<HealPotion>);

    const person = new Person(PersonMode.CommonEnemy);
    person.hurt(50);
    expect(person.Hp).toEqual(person.attributePanel.MaxHp - 50);

    healPotionHandler.usePotion(person);
    expect(person.Hp).toEqual(person.attributePanel.MaxHp - 50 + 5);

    healPotionHandler.usePotion(person);
    expect(person.Hp).toEqual(person.attributePanel.MaxHp - 50 + 5 * 2);
    expect(backpack.getItem(healPotion)?.quantity).toEqual(50);

    const masterPerson = new Person(PersonMode.Master);
    healPotionHandler.usePotion(masterPerson);
    expect(backpack.getItem(healPotion)?.quantity).toEqual(49);
  });

  test('should reset person attack progress after use heal potion', () => {
    vi.useFakeTimers();

    backpack.addItem(healPotion, 50);
    battle.setAcitveEnemyItem(enemy);
    battle.start();
    battle.master?.healPotionHandler.setPotion(backpack.getItem(healPotion)! as BackpackItem<HealPotion>);

    vi.advanceTimersByTime(100);
    expect(battle.master?.actionManager.attackActionTimer.progress).toBeGreaterThan(0);
    battle.master?.healPotionHandler.usePotion(battle.master.person);
    expect(battle.master?.actionManager.attackActionTimer.progress).toEqual(0);

    vi.clearAllTimers();
  });
});

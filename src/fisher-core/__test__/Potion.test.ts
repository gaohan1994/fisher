import { beforeEach, describe, expect, test } from 'vitest';
import { Backpack } from '../fisher-backpack';
import { FisherCore } from '../fisher-core';
import { BackpackItem, HealPotion } from '../fisher-item';
import { Person, PersonMode } from '../fisher-person';
import { HealPotionHandler, PotionSlot } from '../fisher-potion';

let core: FisherCore;
let backpack: Backpack;
beforeEach(() => {
  core = FisherCore.create();
  backpack = core.backpack;
  core.backpack.items.clear();
});

const healPotion = new HealPotion({
  id: 'LowHealPotion',
  name: '下品回灵丹',
  desc: '生命值恢复50点',
  media: 'LowHealPotion',
  price: 5,
  healValue: 5,
});

describe('Potion module', () => {
  test('Potion slot should success set', () => {
    const potionSlot = new PotionSlot<HealPotion>();
    expect(potionSlot.hasPotion).toBeFalsy();
    expect(potionSlot.quantityAvailable).toBeFalsy();
    expect(potionSlot.potionAvailable).toBeFalsy();

    backpack.addItem(healPotion, 50);
    potionSlot.setPotion(backpack.getItem(healPotion)! as BackpackItem<HealPotion>);

    expect(potionSlot.potion).toStrictEqual(backpack.getItem(healPotion));
    expect(potionSlot.potionId).toEqual(healPotion.id);
    expect(potionSlot.hasPotion).toBeTruthy();
    expect(potionSlot.quantityAvailable).toBeTruthy();
    expect(potionSlot.potionAvailable).toBeTruthy();

    potionSlot.clearPotion();
    expect(potionSlot.hasPotion).toBeFalsy();
    expect(potionSlot.quantityAvailable).toBeFalsy();
    expect(potionSlot.potionAvailable).toBeFalsy();
  });

  test('should success use potion', () => {
    const healPotionHandler = new HealPotionHandler();
    backpack.addItem(healPotion, 50);
    healPotionHandler.potionSlot.setPotion(backpack.getItem(healPotion)! as BackpackItem<HealPotion>);

    const person = new Person(PersonMode.Enemy);
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
});

import { makeAutoObservable } from 'mobx';
import { EventKeys, events } from '../fisher-events';
import { Person } from '../fisher-person';
import { HealPotion } from '../fisher-item';
import { PotionSlot } from './PotionSlot';

class HealPotionHandler {
  public potionSlot = new PotionSlot<HealPotion>();

  constructor() {
    makeAutoObservable(this);
  }

  public usePotion = (person: Person) => {
    if (!this.potionSlot.potionAvailable) {
      throw new Error(`Try to use potion but potion is unavailable`);
    }

    person.heal(this.potionSlot.potion!.item.healValue);

    if (person.isMaster) {
      events.emit(EventKeys.Backpack.ReduceItem, this.potionSlot.potion!.item, 1);
    }
  };
}

export { HealPotionHandler };

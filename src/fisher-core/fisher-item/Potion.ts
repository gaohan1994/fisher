import { Assets } from '../assets';
import { EventKeys, events } from '../fisher-events';
import { Person } from '../fisher-person';
import { PotionVariant } from './Constants';
import { AbstractItem, IItem, Item, ItemType } from './Item';

abstract class Potion extends Item {
  public readonly type = ItemType.Potion;

  public abstract variant: PotionVariant;

  public abstract usePotion(person: Person): void;
}

interface IHealPotion extends IItem {
  healValue: number;
}
class HealPotion extends Potion {
  public healValue: number;

  public variant: PotionVariant = PotionVariant.HealPotion;

  constructor(options: IHealPotion) {
    super(options);
    this.healValue = options.healValue;
  }

  public usePotion = (person: Person) => {
    person.heal(this.healValue);
    this.potionQuantityEffect(person);
    this.personActionEffect(person);
  };

  private potionQuantityEffect = (person: Person) => {
    if (person.isMaster) {
      events.emit(EventKeys.Backpack.ReduceItem, this, 1);
    }
  };

  private personActionEffect = (person: Person) => {
    if (person.isMaster && person.isAttacking) {
      person.actionManager.resetAttackActionProgress();
    }
  };
}

class EmptyPotion extends AbstractItem {
  public type = ItemType.Potion;

  public id = 'EmptyPotion';

  public name = '药水-空';

  public desc = '';

  public price = 0;

  public media = Assets[this.id as keyof typeof Assets];
}

export { EmptyPotion, HealPotion, Potion, PotionVariant };
export type { IHealPotion };

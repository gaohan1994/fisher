import { IBonusPotionAttributesKeys } from '../fisher-person';
import { IItem, Item, ItemType } from './Item';

abstract class Potion extends Item {
  public readonly type = ItemType.Potion;
}

interface IHealPotion extends IItem {
  healValue: number;
}
class HealPotion extends Potion {
  public healValue: number;

  constructor(options: IHealPotion) {
    super(options);
    this.healValue = options.healValue;
  }
}

interface IAttributePotion extends IItem {
  attributes: IPotionAttribute[];
}
interface IPotionAttribute {
  key: IBonusPotionAttributesKeys[number];
  value: number;
}
class AttributePotion extends Potion {
  public attributes: IPotionAttribute[];

  constructor(options: IAttributePotion) {
    super(options);
    this.attributes = options.attributes;
  }
}

type PotionVariants = HealPotion | AttributePotion;

export { HealPotion, Potion };
export type { IHealPotion, PotionVariants };

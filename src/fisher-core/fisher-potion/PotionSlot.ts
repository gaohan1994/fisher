import { makeAutoObservable } from 'mobx';
import { Backpack } from '../fisher-backpack';
import { EventKeys, events } from '../fisher-events';
import { BackpackItem, Potion } from '../fisher-item';
import { store } from '../fisher-packages';

class PotionSlot<T extends Potion> {
  public potion?: BackpackItem<T> = undefined;

  public get hasPotion() {
    return this.potion !== undefined;
  }

  public get quantityAvailable() {
    return this.potion !== undefined && this.potion.quantity > 0;
  }

  public get potionAvailable() {
    return this.hasPotion && this.quantityAvailable;
  }

  public get potionId() {
    return this.hasPotion ? this.potion!.item.id : undefined;
  }

  constructor() {
    makeAutoObservable(this);
    events.on(EventKeys.Update.BackpackUpdate, this.listenBackpackPotionChange);
  }

  private listenBackpackPotionChange = (backpack: Backpack) => {
    if (!this.hasPotion) {
      return undefined;
    }

    if (!backpack.checkItem(this.potion!.item)) {
      return this.clearPotion();
    }

    this.setPotion(backpack.getItem(this.potion!.item) as any);
  };

  public setPotionById = (potionId: string) => {
    const potion = store.findItemById(potionId);
    if (potion === undefined) {
      throw new Error(`Try to set potion ${potionId}, but can not find this potion`);
    }

    this.setPotion(Backpack.instance.getItemById(potionId) as any);
  };

  public setPotion = (value: BackpackItem<T>) => {
    this.potion = value;
  };

  public clearPotion = () => {
    this.potion = undefined;
  };
}

export { PotionSlot };

import { action, computed, makeObservable, observable } from 'mobx';
import { SeedHandler } from './Seed';
import { IItem, Item, ItemType } from './Item';

interface ISoil extends IItem {
  unlockLevel: number;
}

class Soil extends Item {
  type = ItemType.Normal;

  @observable
  public unlockLevel: number;

  @observable
  public seedHandler: SeedHandler | undefined = undefined;

  @computed
  public get seed() {
    return this.seedHandler?.seed;
  }

  @computed
  public get seeded() {
    return this.seedHandler !== undefined;
  }

  @observable
  public isPurchased = false;

  @action
  public setPurchased = () => {
    this.isPurchased = true;
  };

  @observable
  public fertility: number = 50;

  @action
  public setFertility = (value: number) => {
    this.fertility = value;
  };

  @observable
  public dry: number = 50;

  @action
  public setDry = (value: number) => {
    this.dry = value;
  };

  @computed
  public get capacity() {
    return (this.fertility + this.dry) / 100;
  }

  constructor(options: ISoil) {
    super(options);
    makeObservable(this);
    this.unlockLevel = options.unlockLevel;
  }
}

export { Soil };

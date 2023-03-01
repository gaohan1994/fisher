import { makeAutoObservable } from 'mobx';
import { BackpackItem } from '@FisherCore';

enum FuiBackpackTabs {
  FullItems,
  Equipments,
}
class BackpackStore {
  public activeBackpackItem: BackpackItem | undefined = undefined;

  public activeTab = FuiBackpackTabs.FullItems;

  constructor() {
    makeAutoObservable(this);
  }

  public setActiveBackpackItem = (item: BackpackItem) => {
    this.activeBackpackItem = item;
  };

  public clearActiveBackpackItem = () => {
    this.activeBackpackItem = undefined;
  };

  public setActiveBackpackTab = (value: FuiBackpackTabs) => {
    this.activeTab = value;
  };
}

const backpackStore = new BackpackStore();
export { backpackStore, FuiBackpackTabs };

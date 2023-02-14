import { makeAutoObservable } from 'mobx';
import { BackpackItem, EquipmentItem } from '@FisherCore';

class BackpackStore {
  public activeBackpackItem: BackpackItem | undefined = undefined;

  public activeEquipment: EquipmentItem | undefined = undefined;

  public showEquipmentsBySlot = false;

  constructor() {
    makeAutoObservable(this);
  }

  public setActiveBackpackItem = (item: BackpackItem) => {
    this.activeBackpackItem = item;
  };

  public clearActiveBackpackItem = () => {
    this.activeBackpackItem = undefined;
  };

  public setActiveEquipment = (equipment: EquipmentItem) => {
    this.activeEquipment = equipment;
  };

  public clearActiveEquipment = () => {
    this.activeEquipment = undefined;
  };

  public changeSlotEquipmentVisible = (visible: boolean) => {
    this.showEquipmentsBySlot = visible;
  };
}

const backpackStore = new BackpackStore();
export { backpackStore };

import { makeAutoObservable } from 'mobx';
import { EquipmentItem } from '@FisherCore';

class MasterStore {
  public activeEquipment: EquipmentItem | undefined = undefined;

  public get hasActiveEquipment() {
    return this.activeEquipment !== undefined;
  }

  constructor() {
    makeAutoObservable(this);
  }

  public setActiveEquipment = (value: EquipmentItem) => {
    this.activeEquipment = value;
  };

  public clearActiveEquipment = () => {
    this.activeEquipment = undefined;
  };
}

const masterStore = new MasterStore();

export { masterStore };

import { makeAutoObservable } from 'mobx';
import { PersonEquipment } from '@FisherCore';

class FuiMasterEquipmentsStore {
  public activePersonEquipment: PersonEquipment | undefined = undefined;

  public showEquipmentsBySlot = false;

  public get hasActivePersonEquipment() {
    return this.activePersonEquipment !== undefined;
  }

  constructor() {
    makeAutoObservable(this);
  }

  public setActivePersonEquipment = (personEquipment: PersonEquipment) => {
    this.activePersonEquipment = personEquipment;
  };

  public clearActivePersonEquipment = () => {
    this.activePersonEquipment = undefined;
  };

  public changeSlotEquipmentVisible = (visible: boolean) => {
    this.showEquipmentsBySlot = visible;
  };
}

const fuiMasterEquipmentsStore = new FuiMasterEquipmentsStore();
export { fuiMasterEquipmentsStore };

import { makeAutoObservable } from 'mobx';
import { PersonEquipment } from '@FisherCore';

class MasterStore {
  public activePersonEquipment: PersonEquipment | undefined = undefined;

  public get hasActivePersonEquipment() {
    return this.activePersonEquipment !== undefined;
  }

  constructor() {
    makeAutoObservable(this);
  }

  public setActivePersonEquipment = (value: PersonEquipment) => {
    this.activePersonEquipment = value;
  };

  public clearActivePersonEquipment = () => {
    this.activePersonEquipment = undefined;
  };
}

const masterStore = new MasterStore();

export { masterStore };

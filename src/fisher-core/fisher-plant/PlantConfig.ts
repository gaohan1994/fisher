import { makeAutoObservable } from 'mobx';

class PlantConfig {
  constructor() {
    makeAutoObservable(this);
  }
}

export { PlantConfig };

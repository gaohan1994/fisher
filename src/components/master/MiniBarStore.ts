import { makeAutoObservable } from 'mobx';

class MiniBarStore {
  public visible = false;

  constructor() {
    makeAutoObservable(this);
  }

  public openMiniBar = () => {
    this.visible = true;
  };

  public closeMiniBar = () => {
    this.visible = false;
  };

  public toggleMiniBar = () => {
    this.visible = !this.visible;
  };
}

const miniBarStore = new MiniBarStore();

export { miniBarStore };

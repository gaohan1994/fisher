import { autorun, makeAutoObservable } from 'mobx';
import { Battle, Dungeon, ComponentId, core } from '@FisherCore';

class MiniFightStore {
  public miniFightVisible = false;

  public activeFightComponent: Battle | Dungeon | undefined = undefined;

  constructor() {
    makeAutoObservable(this);

    autorun(() => {
      if (core.activeComponentId !== ComponentId.Battle && core.activeComponentId !== ComponentId.Dungeon) {
        this.closeMiniFight();
      }

      if (core.activeComponentId === ComponentId.Battle) {
        this.setActiveFightComponent(core.battle);
        this.openMiniFight();
      }

      if (core.activeComponentId === ComponentId.Dungeon) {
        this.setActiveFightComponent(core.dungeon);
        this.openMiniFight();
      }
    });
  }

  private openMiniFight = () => {
    this.miniFightVisible = true;
  };

  private closeMiniFight = () => {
    this.miniFightVisible = false;
  };

  private setActiveFightComponent = (component: Battle | Dungeon) => {
    this.activeFightComponent = component;
  };
}

export { MiniFightStore };

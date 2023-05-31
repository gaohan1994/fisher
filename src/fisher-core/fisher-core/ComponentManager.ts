import invariant from 'invariant';
import { makeAutoObservable } from 'mobx';
import { prefixLogger, prefixes } from '@FisherLogger';
import { battle, Battle } from '../fisher-battle';
import { cook, Cook, forge, Forge, mining, Mining, reiki, Reiki } from '../fisher-modules';
import { bank, Bank } from '../fisher-bank';
import { backpack, Backpack } from '../fisher-backpack';
import { EventKeys, events } from '../fisher-events';
import { Master, master } from '../fisher-person';
import { Dungeon, dungeon } from '../fisher-dungeon';

type FisherComponent = Bank | Backpack | Mining | Reiki | Forge | Cook | Battle | Dungeon | Master;

type ActiveControlComponent = Mining | Reiki | Forge | Cook | Battle | Dungeon;

type ComponentWithExperience = Mining | Reiki | Forge | Cook | Master;

enum ComponentId {
  Bank = 'Bank',
  Backpack = 'Backpack',
  Mining = 'Mining',
  Reiki = 'Reiki',
  Forge = 'Forge',
  Cook = 'Cook',
  Battle = 'Battle',
  Dungeon = 'Dungeon',
  Master = 'Master',
}

class ComponentManager {
  private static readonly logger = prefixLogger(prefixes.FISHER_CORE, 'ComponentManager');

  public static instance: ComponentManager;

  public static create(): ComponentManager {
    if (!ComponentManager.instance) {
      ComponentManager.instance = new ComponentManager();
    }
    return ComponentManager.instance;
  }

  public componentMap = new Map<string, FisherComponent>();

  public activeComponent: ActiveControlComponent | undefined = undefined;

  public get activeComponentId() {
    return this.activeComponent?.id;
  }

  public get components() {
    return [...this.componentMap.values()];
  }

  public get bank() {
    return this.componentMap.get(ComponentId.Bank) as Bank;
  }

  public get backpack() {
    return this.componentMap.get(ComponentId.Backpack) as Backpack;
  }

  public get mining() {
    return this.componentMap.get(ComponentId.Mining) as Mining;
  }

  public get reiki() {
    return this.componentMap.get(ComponentId.Reiki) as Reiki;
  }

  public get forge() {
    return this.componentMap.get(ComponentId.Forge) as Forge;
  }

  public get cook() {
    return this.componentMap.get(ComponentId.Cook) as Cook;
  }

  public get battle() {
    return this.componentMap.get(ComponentId.Battle) as Battle;
  }

  public get dungeon() {
    return this.componentMap.get(ComponentId.Dungeon) as Dungeon;
  }

  public get master() {
    return this.componentMap.get(ComponentId.Master) as Master;
  }

  constructor() {
    makeAutoObservable(this);

    this.componentMap.set(ComponentId.Master, master);
    this.componentMap.set(ComponentId.Bank, bank);
    this.componentMap.set(ComponentId.Backpack, backpack);
    this.componentMap.set(ComponentId.Battle, battle);
    this.componentMap.set(ComponentId.Dungeon, dungeon);
    this.componentMap.set(ComponentId.Mining, mining);
    this.componentMap.set(ComponentId.Reiki, reiki);
    this.componentMap.set(ComponentId.Forge, forge);
    this.componentMap.set(ComponentId.Cook, cook);

    events.on(EventKeys.Core.SetActiveComponent, this.setActiveComponent);
    events.on(EventKeys.Archive.ExitArchive, this.stopActiveComponent);
    events.on(EventKeys.Reward.RewardExperience, this.onRewardExperience);
  }

  private onRewardExperience = (componentId: string, experience: number) => {
    const component = this.componentMap.get(componentId) as ComponentWithExperience;
    invariant(component !== undefined, `Try to add experience to undefined component ${componentId}`);

    component.receiveExperience(experience);
    ComponentManager.logger.debug(`'Execute add ${componentId} experience: ${experience}`);
  };

  public setActiveComponent = (component: ActiveControlComponent) => {
    if (this.activeComponent !== component) {
      this.stopActiveComponent();
      this.activeComponent = component;
      ComponentManager.logger.info(`Set active component ${component === undefined ? 'undefined' : component.id}`);
    }
  };

  public clearActiveComponent = () => {
    this.activeComponent = undefined;
    ComponentManager.logger.info('Clear active component');
  };

  private stopActiveComponent = () => {
    if (this.activeComponent !== undefined) {
      this.activeComponent?.stop();
    }
  };
}

export { ComponentManager, ComponentId };
export type { FisherComponent };

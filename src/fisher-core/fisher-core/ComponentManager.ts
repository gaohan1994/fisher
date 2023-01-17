import invariant from 'invariant';
import { prefixLogger, prefixes } from '@FisherLogger';
import { battle, Battle } from '../fisher-battle';
import { forge, Forge, mining, Mining, reiki, Reiki } from '../fisher-modules';
import { bank, Bank } from '../fisher-bank';
import { backpack, Backpack } from '../fisher-backpack';
import { EventKeys, events } from '../fisher-events';

type FisherComponent = Bank | Backpack | Mining | Reiki | Forge | Battle;

type ActiveControlComponent = Mining | Reiki | Forge | Battle;

type ComponentWithExperience = Mining | Reiki | Forge;

enum ComponentId {
  Bank = 'Bank',
  Backpack = 'Backpack',
  Mining = 'Mining',
  Reiki = 'Reiki',
  Forge = 'Forge',
  Battle = 'Battle',
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

  private componentMap = new Map<string, FisherComponent>();

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

  public get battle() {
    return this.componentMap.get(ComponentId.Battle) as Battle;
  }

  constructor() {
    this.initializeComponentMap();

    events.on(EventKeys.Core.SetActiveComponent, this.setActiveComponent);
    events.on(EventKeys.Archive.ExitArchive, this.stopActiveComponent);
    events.on(EventKeys.Reward.RewardExperience, this.onRewardExperience);
  }

  private onRewardExperience = (componentId: string, experience: number) => {
    const component = this.componentMap.get(componentId) as ComponentWithExperience;
    invariant(component !== undefined, `Try to add experience to undefined component ${componentId}`);

    component.addExperience(experience);
    ComponentManager.logger.debug(`'Execute reward skill experience: ${componentId}, experience: ${experience}`);
  };

  public setActiveComponent = (component: ActiveControlComponent | undefined) => {
    if (this.activeComponent !== component) {
      this.stopActiveComponent();
      this.activeComponent = component;
      ComponentManager.logger.info(`Set active component ${component === undefined ? 'undefined' : component.id}`);
    }
  };

  private stopActiveComponent = () => {
    if (this.activeComponent !== undefined) {
      this.activeComponent?.stop();
    }
  };

  private initializeComponentMap = () => {
    this.componentMap.set(ComponentId.Bank, bank);
    this.componentMap.set(ComponentId.Backpack, backpack);
    this.componentMap.set(ComponentId.Mining, mining);
    this.componentMap.set(ComponentId.Reiki, reiki);
    this.componentMap.set(ComponentId.Forge, forge);
    this.componentMap.set(ComponentId.Battle, battle);
  };
}

export { ComponentManager };

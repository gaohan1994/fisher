import { prefixLogger, prefixes } from '@FisherLogger';
import { battle, Battle } from '../fisher-battle';
import { forge, Forge, mining, Mining, reiki, Reiki } from '../fisher-modules';

export type FisherComponent = Mining | Reiki | Forge | Battle;

enum ComponentId {
  Mining = 'Mining',
  Reiki = 'Reiki',
  Forge = 'Forge',
  Battle = 'Battle',
}

export class ComponentManager {
  private static readonly logger = prefixLogger(prefixes.FISHER_CORE, 'ComponentManager');

  private componentMap = new Map<string, FisherComponent>();

  private skillComponentMap = new Map<string, SkillComponent<any>>();

  public get componentIds() {
    return [...this.componentMap.keys()];
  }

  public get components() {
    return [...this.componentMap.values()];
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

  public activeComponent: FisherComponent | undefined = undefined;

  public get activeComponentId() {
    return this.activeComponent?.id;
  }

  constructor() {
    this.initializeComponentMap();
    this.initializeSkillComponentMap();
  }

  public findComponentById = <T = FisherComponent>(componentId: ComponentId[number]): T => {
    const result = this.componentMap.get(componentId);

    if (result === undefined) {
      return ComponentManager.logger.error(`Didn't find component: ${componentId}`);
    }

    return result as T;
  };

  public findSkillComponentById = <T extends Mining | Reiki | Forge>(
    componentId: ComponentId[number]
  ): SkillComponent<T> => {
    const result = this.skillComponentMap.get(componentId);

    if (result === undefined) {
      return ComponentManager.logger.error(`Didn't find skill by componentId: ${componentId}`);
    }

    return result;
  };

  public setActiveComponent = (component: FisherComponent) => {
    if (this.activeComponent !== component) {
      this.activeComponent?.stop();
      this.activeComponent = component;
      ComponentManager.logger.info(`Set active component ${component.id}`);
    }
  };

  private initializeComponentMap = () => {
    this.componentMap.set(ComponentId.Mining, mining);
    this.componentMap.set(ComponentId.Reiki, reiki);
    this.componentMap.set(ComponentId.Forge, forge);
    this.componentMap.set(ComponentId.Battle, battle);
  };

  private initializeSkillComponentMap = () => {
    this.skillComponentMap.set(ComponentId.Mining, new SkillComponent(mining));
    this.skillComponentMap.set(ComponentId.Reiki, new SkillComponent(reiki));
    this.skillComponentMap.set(ComponentId.Forge, new SkillComponent(forge));
  };
}

class SkillComponent<T extends Mining | Reiki | Forge> {
  public component: T;

  constructor(component: T) {
    this.component = component;
  }

  public get skill() {
    return this.component.skill;
  }
}

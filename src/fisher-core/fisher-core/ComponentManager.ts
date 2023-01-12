import invariant from 'invariant';
import { prefixLogger, prefixes } from '@FisherLogger';
import { battle, Battle } from '../fisher-battle';
import { forge, Forge, mining, Mining, reiki, Reiki } from '../fisher-modules';
import { bank, Bank } from '../fisher-bank';
import { backpack, Backpack } from '../fisher-backpack';
import { EventKeys, events } from '../fisher-events';

type FisherComponent = Bank | Backpack | Mining | Reiki | Forge | Battle;

type ActiveControlComponent = Mining | Reiki | Forge | Battle;

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

  private componentMap = new Map<string, FisherComponent>();

  private skillComponentMap = new Map<string, SkillComponent<any>>();

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
    this.initializeSkillComponentMap();

    events.on(EventKeys.Core.SetActiveComponent, this.setActiveComponent);
    events.on(EventKeys.Reward.RewardExperience, this.onRewardExperience);
  }

  private onRewardExperience = (componentId: string, experience: number) => {
    const skillComponent = this.skillComponentMap.get(componentId);
    invariant(skillComponent !== undefined, `Try to add experience to undefined component ${componentId}`);

    const { skill } = skillComponent;
    skill.addExperience(experience);
    ComponentManager.logger.debug(`'Execute reward skill experience: ${componentId}, experience: ${experience}`);
  };

  public setActiveComponent = (component: ActiveControlComponent | undefined) => {
    if (this.activeComponent !== component) {
      this.activeComponent?.stop();
      this.activeComponent = component;
      ComponentManager.logger.info(`Set active component ${component === undefined ? 'undefined' : component.id}`);
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

export { ComponentManager };

import invariant from 'invariant';
import { makeAutoObservable } from 'mobx';
import { prefixLogger, prefixes } from '@FisherLogger';
import { Master } from '../fisher-person';
import { Bank } from '../fisher-bank';
import { Backpack } from '../fisher-backpack';
import { Cook, Forge, Mining, Reiki } from '../fisher-modules';
import { EventKeys, events } from '../fisher-events';
import { Dungeon } from '../fisher-dungeon';
import { Battle } from '../fisher-battle';
import { Information, InformationMessage, information, informationAlert, informationTip } from '../fisher-information';

type FisherComponent = Bank | Backpack | Mining | Reiki | Forge | Cook | Battle | Dungeon | Master | Information;

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
  Information = 'Information',
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

  public get information() {
    return this.componentMap.get(ComponentId.Information) as Information;
  }

  constructor() {
    makeAutoObservable(this);

    this.componentMap.set(ComponentId.Master, Master.create());
    this.componentMap.set(ComponentId.Bank, Bank.create());
    this.componentMap.set(ComponentId.Backpack, Backpack.create());
    this.componentMap.set(ComponentId.Battle, Battle.create());
    this.componentMap.set(ComponentId.Dungeon, Dungeon.create());
    this.componentMap.set(ComponentId.Mining, Mining.create());
    this.componentMap.set(ComponentId.Reiki, Reiki.create());
    this.componentMap.set(ComponentId.Forge, Forge.create());
    this.componentMap.set(ComponentId.Cook, Cook.create());
    this.componentMap.set(ComponentId.Information, information);

    events.on(EventKeys.Core.SetActiveComponent, this.setActiveComponent);
    events.on(EventKeys.Archive.ExitArchive, this.stopActiveComponent);
    events.on(EventKeys.Reward.RewardExperience, this.onRewardExperience);
    events.on(EventKeys.Information.Messages, this.onReceiveInformationMessages);
  }

  private onRewardExperience = (componentId: string, experience: number, shouldAlertInformation = false) => {
    const component = this.componentMap.get(componentId) as ComponentWithExperience;
    invariant(component !== undefined, `Try to add experience to undefined component ${componentId}`);

    component.receiveExperience(experience);
    ComponentManager.logger.debug(`'Execute add ${componentId} experience: ${experience}`);

    const message = new Information.ExperienceMessage(componentId, experience);
    events.emit(EventKeys.Information.Messages, [message], shouldAlertInformation);
  };

  private onReceiveInformationMessages = (messages: InformationMessage[], shouldAlertInformation = false) => {
    if (shouldAlertInformation) {
      informationAlert(messages);
    } else {
      informationTip(messages);
    }
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

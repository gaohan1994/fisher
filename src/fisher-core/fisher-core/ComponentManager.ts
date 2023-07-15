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
import { ArchiveInterface } from '../fisher-archive';
import { FisherCoreError } from '../fisher-error';
import { isBattle, isDungeon, isWithSkillComponent } from './ComponentChecker';
import { HangUpBattleManager, HangUpDungeonManager, HangUpRecipeHandler, HangUpTime } from '../fisher-hang-up';
import { ActiveControlComponent, ComponentId, ComponentWithExperience, FisherComponent } from './Constants';

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
    events.on(EventKeys.Archive.LoadArchive, this.controlLastActiveComponent);
  }

  private onRewardExperience = (componentId: string, experience: number, shouldAlertInformation = false) => {
    const component = this.componentMap.get(componentId) as ComponentWithExperience;
    invariant(component !== undefined, `Try to add experience to undefined component ${componentId}`);

    component.receiveExperience(experience);
    ComponentManager.logger.debug(`'Execute add ${componentId} experience: ${experience}`);

    const message = new Information.ExperienceMessage(component, experience);
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

    events.emit(EventKeys.Archive.SaveFullArchive);
  };

  public clearActiveComponent = () => {
    this.activeComponent = undefined;
    events.emit(EventKeys.Archive.SaveFullArchive);

    ComponentManager.logger.info('Clear active component');
  };

  private stopActiveComponent = () => {
    if (this.activeComponent !== undefined) {
      this.activeComponent?.stop();
    }
  };

  private controlLastActiveComponent = async (values: ArchiveInterface.ArchiveValues) => {
    const { activeComponentId, activeComponentLastActiveTime } = values;
    if (activeComponentId === undefined) {
      return this.clearActiveComponent();
    }
    if (activeComponentLastActiveTime === undefined) {
      throw new Error(`Got active component ${activeComponentId}, but last active time was undefined`);
    }

    const component = this.componentMap.get(activeComponentId);
    const hangUpTime = new HangUpTime(activeComponentLastActiveTime);

    if (component === undefined) {
      throw new FisherCoreError(
        `Find an undefined active component ${activeComponentId}`,
        `没有找到组件${activeComponentId}`
      );
    }

    if (isWithSkillComponent(component)) {
      const archiveComponentValues = values[component.id.toLocaleLowerCase() as 'mining' | 'reiki' | 'forge' | 'cook'];

      if (archiveComponentValues === undefined || archiveComponentValues.activeRecipeId === undefined) {
        throw new FisherCoreError(
          `Try to hang up component ${activeComponentId}, but did not find active component values`,
          '挂机组件错误'
        );
      }

      const hangUpRecipeHandler = new HangUpRecipeHandler(this, hangUpTime, archiveComponentValues, values);
      component.start(hangUpRecipeHandler.recipe);
    }

    if (isBattle(component)) {
      const archiveValues = Object.assign({}, values);
      const archiveComponentValues = Object.assign({}, values[component.id.toLocaleLowerCase() as 'battle']);

      if (archiveComponentValues === undefined || archiveComponentValues.activeEnemyId === undefined) {
        throw new FisherCoreError(
          `Try to hang up component ${activeComponentId}, but did not find active component values`,
          '挂机组件错误'
        );
      }

      const battleHangUpManager = new HangUpBattleManager(hangUpTime, archiveComponentValues, archiveValues);
      component.setAcitveEnemyItem(battleHangUpManager.enemyItem);
      component.start();
    }

    if (isDungeon(component)) {
      const archiveValues = Object.assign({}, values);
      const archiveComponentValues = Object.assign({}, values[component.id.toLocaleLowerCase() as 'dungeon']);

      if (archiveComponentValues === undefined || archiveComponentValues.activeDungeonItemId === undefined) {
        throw new FisherCoreError(
          `Try to hang up component ${activeComponentId}, but did not find active component values`,
          '挂机组件错误'
        );
      }

      const dungeonHangUpManager = new HangUpDungeonManager(hangUpTime, archiveComponentValues, archiveValues);
      component.setActiveDungeonItem(dungeonHangUpManager.dungeonItem);
      component.start();
    }
  };
}

export { ComponentManager, ComponentId };
export type { FisherComponent };

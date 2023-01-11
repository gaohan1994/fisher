import { makeAutoObservable, reaction } from 'mobx';
import { prefixes, prefixLogger } from '@FisherLogger';
import { Person, master } from '../fisher-person';
import { bank } from '../fisher-bank';
import { prompt } from '../fisher-prompt';
import { backpack } from '../fisher-backpack';
import { BackpackItem, Item } from '../fisher-item';
import { events, EventKeys } from '../fisher-events';
import { ComponentManager, FisherComponent } from './ComponentManager';
export class FisherCore {
  public static logger = prefixLogger(prefixes.FISHER_CORE, 'FisherCore');

  public static instance: FisherCore;

  public static create(): FisherCore {
    if (!FisherCore.instance) {
      FisherCore.instance = new FisherCore();
    }
    return FisherCore.instance;
  }

  public archive: any | undefined = undefined;

  public gameReady = false;

  private componentManager = new ComponentManager();

  private events = events;

  public get activeComponent() {
    return this.componentManager.activeComponent;
  }

  public get activeComponentId() {
    return this.componentManager.activeComponentId;
  }

  public get mining() {
    return this.componentManager.mining;
  }

  public get reiki() {
    return this.componentManager.reiki;
  }

  public get forge() {
    return this.componentManager.forge;
  }

  public get battle() {
    return this.componentManager.battle;
  }

  // 推送
  public readonly prompt = prompt;

  // 玩家
  public readonly master = master;

  // 货币
  public readonly bank = bank;

  // 背包
  public readonly backpack = backpack;

  /**
   * Creates an instance of FisherCore.
   *
   * - 初始化各个模块如
   * - 从资源池中注册游戏数据包如 PackagesData
   * - 从存档中取出用户数据并初始化
   *
   * @memberof FisherCore
   */
  constructor() {
    makeAutoObservable(this);

    this.initializeEventBusHandler();

    reaction(
      () => this.archive,
      async (archive) => {
        await this.loadArchive(archive);
        this.setGameReady(true);
      }
    );
  }
  public findComponentById = (componentId: string) => {
    return this.componentManager.findComponentById(componentId);
  };

  public setActiveComponent = (component: FisherComponent) => {
    this.componentManager.setActiveComponent(component);
  };

  public setGameReady = (isReady: boolean) => {
    this.gameReady = isReady;
  };

  public setArchive = (archive: any) => {
    this.archive = archive;
  };

  public quitArchive = () => {
    this.archive = undefined;
    this.setGameReady(false);
  };

  private loadArchive = async (archive: any) => {
    await this.master.initialize({
      name: '李逍遥',
      level: Person.Level.GasRefiningLater,
    });

    await this.bank.initialize();

    await this.backpack.initialize();
  };

  private initializeEventBusHandler = () => {
    this.initializeBackpackEvents();
    this.initializeRewardEvents();
  };

  private initializeBackpackEvents = () => {
    this.events.on(EventKeys.Backpack.AddItem, this.onAddItem);
    this.events.on(EventKeys.Backpack.ReduceItem, this.onReduceItem);
    this.events.on(EventKeys.Backpack.SellItem, this.onSellItem);
  };

  private onAddItem = (item: Item, quantity: number) => {
    this.backpack.addItem(item, quantity);
  };

  private onReduceItem = (item: Item, quantity: number) => {
    this.backpack.addItem(item, quantity);
  };

  private onSellItem = (item: BackpackItem, quantity?: number) => {
    this.backpack.sellItem(item, quantity);
  };

  private initializeRewardEvents = () => {
    this.events.on(EventKeys.Reward.RewardGold, this.onRewardGold);
    this.events.on(EventKeys.Reward.RewardItem, this.onRewardItem);
    this.events.on(EventKeys.Reward.RewardExperience, this.onRewardExperience);
  };

  private onRewardGold = (gold: number) => {
    this.bank.receiveGold(gold);
    FisherCore.logger.debug(`Execute reward gold: ${gold}`);
  };

  private onRewardItem = (item: Item, quantity: number) => {
    if (quantity > 0) {
      this.backpack.addItem(item, quantity);
      FisherCore.logger.debug(`Execute add item: ${item.id}, quantity: ${quantity}`);
    } else {
      this.backpack.reduceItem(item, quantity);
      FisherCore.logger.debug(`Execute reduce item: ${item.id}, quantity: ${quantity}`);
    }
  };

  private onRewardExperience = (componentId: string, experience: number) => {
    const { skill } = this.componentManager.findSkillComponentById(componentId);
    skill.addExperience(experience);
    FisherCore.logger.debug(`'Execute reward skill experience: ${componentId}, experience: ${experience}`);
  };
}

export const core = FisherCore.create();

(window as any).core = core;

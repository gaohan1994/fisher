import { makeAutoObservable, reaction } from 'mobx';
import { prefixes, prefixLogger } from '@FisherLogger';
import { Person, master } from '../fisher-person';
import { prompt } from '../fisher-prompt';
import { events } from '../fisher-events';
import { ComponentManager } from './ComponentManager';
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

  public events = events;

  private componentManager = new ComponentManager();

  public get activeComponent() {
    return this.componentManager.activeComponent;
  }

  public get activeComponentId() {
    return this.componentManager.activeComponentId;
  }

  public get bank() {
    return this.componentManager.bank;
  }

  public get backpack() {
    return this.componentManager.backpack;
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

    reaction(
      () => this.archive,
      async (archive) => {
        await this.loadArchive(archive);
        this.setGameReady(true);
      }
    );
  }

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
}

export const core = FisherCore.create();

(window as any).core = core;

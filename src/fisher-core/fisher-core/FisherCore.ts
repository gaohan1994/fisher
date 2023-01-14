import { makeAutoObservable } from 'mobx';
import { prefixes, prefixLogger } from '@FisherLogger';
import { master } from '../fisher-person';
import { prompt } from '../fisher-prompt';
import { events } from '../fisher-events';
import { ArchiveManager } from '../fisher-archive';
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

  public events = events;

  public archiveManager = new ArchiveManager();

  public get gameReady() {
    return this.archiveManager.hasActiveArchive;
  }

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
  }
}

export const core = FisherCore.create();

(window as any).core = core;

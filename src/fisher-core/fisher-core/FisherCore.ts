import { makeAutoObservable, reaction } from 'mobx';
import invariant from 'invariant';
import { prefixLogger, prefixes } from '@FisherLogger';
import { Mining, mining, Reiki, reiki } from '../fisher-modules';
import { FisherPerson, master } from '../fisher-person';
import { bank } from '../fisher-bank';
import { prompt } from '../fisher-prompt';
import { Battle } from '../fisher-battle';
import { backpack } from '../fisher-backpack';

type FisherComponent = Mining | Reiki | Battle | undefined;

export class FisherCore {
  private static readonly logger = prefixLogger(prefixes.FISHER_CORE);

  public static instance: FisherCore;

  public static create(): FisherCore {
    if (!FisherCore.instance) {
      FisherCore.instance = new FisherCore();
    }
    return FisherCore.instance;
  }

  public archive: any | undefined = undefined;

  public gameReady = false;

  // 推送
  public readonly prompt = prompt;

  // 玩家
  public readonly master = master;

  // 货币
  public readonly bank = bank;

  // 背包
  public readonly backpack = backpack;

  // 采矿
  public readonly mining = mining;

  // 灵气
  public readonly reiki = reiki;

  // 当前处于激活状态的组件
  public activeComponent: FisherComponent | undefined = undefined;

  public get activeComponentId() {
    return this.activeComponent?.id;
  }

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

  /**
   * 设置激活的组件
   * 如果当前激活组件不等于传入的组件
   * 设置激活组件为传入组件
   * 如果当前激活的组件不为空则关闭当前组件
   *
   * @param {FisherComponent} component
   * @memberof FisherCore
   */
  public setActiveComponent = (component: FisherComponent) => {
    invariant(
      component !== undefined,
      'Tried setting active component to undefined!'
    );
    if (this.activeComponent !== component) {
      this.activeComponent?.stop();
      this.activeComponent = component;
      FisherCore.logger.info(`Set active component ${component.id}`);
    }
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
      level: FisherPerson.Level.GasRefiningLater,
    });

    await this.bank.initialize();

    await this.backpack.initialize();
  };
}

export const core = FisherCore.create();

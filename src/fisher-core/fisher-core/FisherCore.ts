import { makeAutoObservable } from 'mobx';
import { prefixes, prefixLogger } from '@FisherLogger';
import { master } from '../fisher-person';
import { prompt } from '../fisher-prompt';
import { events } from '../fisher-events';
import { ArchiveManager } from '../fisher-archive';
import { ComponentManager } from './ComponentManager';
import { version } from './Version';
export class FisherCore {
  public version = version;

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

  public componentManager = ComponentManager.create();

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

  public get master() {
    return this.componentManager.master;
  }

  public readonly prompt = prompt;

  constructor() {
    makeAutoObservable(this);
  }
}

export const core = FisherCore.create();

(window as any).core = core;

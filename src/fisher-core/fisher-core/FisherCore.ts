import { makeAutoObservable } from 'mobx';
import { prefixes, prefixLogger } from '@FisherLogger';
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

  public get cook() {
    return this.componentManager.cook;
  }

  public get battle() {
    return this.componentManager.battle;
  }

  public get dungeon() {
    return this.componentManager.dungeon;
  }

  public get master() {
    return this.componentManager.master;
  }

  public readonly prompt = prompt;

  public archiveManager = new ArchiveManager(this);

  public get gameReady() {
    return this.archiveManager.hasActiveArchive;
  }

  constructor() {
    makeAutoObservable(this);
  }
}

export const core = FisherCore.create();

(window as any).core = core;

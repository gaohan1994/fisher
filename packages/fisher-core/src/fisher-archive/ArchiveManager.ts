import localforage from 'localforage';
import { makeAutoObservable } from 'mobx';
import { prefixes, prefixLogger } from '@fisher/logger';
import { Timer } from '@timer';
import { FisherCore } from '@core';
import { EventKeys, events } from '@shared';
import { Archive } from './Archive';
import { ArchiveInterface } from './Types';
import { ArchiveHandler } from './ArchiveHandler';
import { ArchiveConstants, archiveStore } from './Constants';

const ArchiveAutoSaveInterval = 1000 * 10;

class ArchiveManager {
  public static logger = prefixLogger(prefixes.FISHER_CORE, 'ArchiveManager');

  private readonly _core: FisherCore;

  private archiveMap = new Map<string, Archive>();

  public get hasArchive() {
    return this.archiveMap.size > 0;
  }

  public get archiveList() {
    return [...this.archiveMap.values()].sort((a, b) => b.lastUpdateTime - a.lastUpdateTime);
  }

  private get archiveManagerStore() {
    return localforage.createInstance({ name: ArchiveConstants.ArchiveManagerStore.StoreName });
  }

  public archiveHandler = new ArchiveHandler();

  private archiveAutoSaveTimer = new Timer('ArchiveAutoSaveTimer', () => this.autoSaveArchiveAction());

  public get activeArchive() {
    return this.archiveHandler.activeArchive;
  }

  public get hasActiveArchive() {
    return this.archiveHandler.hasActiveArchive;
  }

  constructor(core: FisherCore) {
    makeAutoObservable(this);

    this._core = core;
    this.initialize();
    events.on(EventKeys.Archive.SaveFullArchive, this.onSaveFullArchive);
  }

  private initialize = async () => {
    await this.refreshArchiveMap();
    await this.refreshActiveArchive();
  };

  public createNewArchive = async (masterName: string) => {
    const [archiveKey] = await this.archiveHandler.createNewArchive(masterName);
    await this.refreshArchiveMap();
    await this.saveActiveArchiveKey(archiveKey);
    await this.refreshActiveArchive();
  };

  public loadArchive = async (archiveKey: string) => {
    await this.saveActiveArchiveKey(archiveKey);
    await this.refreshActiveArchive();
  };

  public getActiveArchiveValues = () => {
    return this.activeArchive?.values;
  };

  public onSaveFullArchive = async () => {
    await this.archiveHandler.saveFullArchive(this._core);
  };

  private autoSaveArchiveAction = async () => {
    if (this.hasActiveArchive) {
      ArchiveManager.logger.debug(`Auto save archive ${this.activeArchive!.archiveKey}`);
      this.onSaveFullArchive();
    }
  };

  public exitActiveArchive = async () => {
    await this.onSaveFullArchive();
    await this.archiveHandler.exitActiveArchive();
    await this.saveActiveArchiveKey(null);
    await this.refreshActiveArchive();
  };

  public deleteArchive = async (archiveKey: string) => {
    if (archiveKey === this.archiveHandler.activeArchive?.archiveKey) {
      ArchiveManager.logger.error(`Try to delete active archive ${archiveKey}`);
      throw new Error(`Try to delete active archive ${archiveKey}`);
    }

    const archive = this.archiveMap.get(archiveKey);
    if (!archive) {
      ArchiveManager.logger.error(`Try to delete null archive`);
      throw new Error(`Try to delete null archive`);
    }

    await this.archiveHandler.deleteArchive(archive);
    await this.refreshArchiveMap();
  };

  private refreshArchiveMap = async () => {
    await archiveStore
      .iterate<ArchiveInterface.ArchiveValues, void>((archiveValue, archiveKey) => {
        const archive = new Archive(archiveValue);

        if (this.checkArchiveIsAvailable(archive)) {
          this.archiveMap.set(archiveKey, archive);
        } else {
          this.archiveMap.delete(archiveKey);
        }
      })
      .catch((error) => ArchiveManager.logger.error(`Fail to initialize archives`, error));
  };

  private checkArchiveIsAvailable = (archive: Archive) => {
    if (archive.deleted === true) {
      return false;
    }
    return true;
  };

  private refreshActiveArchive = async () => {
    const activeArchiveKey = await this.getActiveArchiveKey();
    const activeArchive = this.archiveMap.get(activeArchiveKey ?? '');

    if (activeArchive !== undefined) {
      this.archiveHandler.setActiveArchive(activeArchive);
      this.archiveAutoSaveTimer.startTimer(ArchiveAutoSaveInterval);
    } else {
      this.archiveAutoSaveTimer.stopTimer();
    }
  };

  private getActiveArchiveKey = async (): Promise<string | null> => {
    return await this.archiveManagerStore.getItem<string>(
      ArchiveConstants.ArchiveManagerStore.StoreKeys.ActiveArchiveKey
    );
  };

  private saveActiveArchiveKey = async (archiveKey: string | null) => {
    ArchiveManager.logger.info(`Save active archive key ${archiveKey}`);
    return await this.archiveManagerStore.setItem(
      ArchiveConstants.ArchiveManagerStore.StoreKeys.ActiveArchiveKey,
      archiveKey
    );
  };
}

export { ArchiveManager };

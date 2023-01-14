import localforage from 'localforage';
import { makeAutoObservable } from 'mobx';
import { prefixes, prefixLogger } from '@FisherLogger';
import { Archive } from './Archive';
import { ArchiveInterface } from './Types';
import { ArchiveHandler } from './ArchiveHandler';
import { ArchiveConstants, archiveStore } from './Constants';

class ArchiveManager {
  public static logger = prefixLogger(prefixes.FISHER_CORE, 'ArchiveManager');

  private archiveMap = new Map<string, Archive>();

  public get hasArchive() {
    return this.archiveMap.size > 0;
  }

  public get archiveList() {
    return [...this.archiveMap.values()];
  }

  private get archiveManagerStore() {
    return localforage.createInstance({ name: ArchiveConstants.ArchiveManagerStore.StoreName });
  }

  private archiveHandler = new ArchiveHandler();

  public get activeArchive() {
    return this.archiveHandler.activeArchive;
  }

  constructor() {
    makeAutoObservable(this);
    this.initialize();
  }

  private initialize = async () => {
    // load archive map
    await this.refreshArchiveMap();

    // load active archive
    await this.refreshActiveArchive();
  };

  public createNewArchive = async (masterName: string) => {
    const [archiveKey, archive] = await this.archiveHandler.createNewArchive(masterName);

    await this.refreshArchiveMap();
    await this.saveActiveArchiveKey(archiveKey);

    this.archiveHandler.setActiveArchive(archive);
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

    if (activeArchive === undefined) {
      ArchiveManager.logger.error(`Try to set active archive as undefined`);
      throw new Error(`Try to set active archive as undefined`);
    }

    this.archiveHandler.setActiveArchive(activeArchive);
  };

  private getActiveArchiveKey = async (): Promise<string | null> => {
    return await this.archiveManagerStore.getItem<string>(
      ArchiveConstants.ArchiveManagerStore.StoreKeys.ActiveArchiveKey
    );
  };

  private saveActiveArchiveKey = async (archiveKey: string) => {
    ArchiveManager.logger.info(`Save active archive key ${archiveKey}`);
    return await this.archiveManagerStore.setItem(
      ArchiveConstants.ArchiveManagerStore.StoreKeys.ActiveArchiveKey,
      archiveKey
    );
  };
}

export { ArchiveManager };

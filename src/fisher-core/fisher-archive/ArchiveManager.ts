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

  private refreshArchiveMap = async () => {
    return await archiveStore
      .iterate<ArchiveInterface.ArchiveValues, void>((archive, archiveKey) => {
        this.archiveMap.set(archiveKey, new Archive(archive));
      })
      .catch((error) => ArchiveManager.logger.error(`Fail to initialize archives`, error));
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

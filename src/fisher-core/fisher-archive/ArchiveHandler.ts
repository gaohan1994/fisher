import { makeAutoObservable } from 'mobx';
import { prefixes, prefixLogger } from '@FisherLogger';
import { EventKeys, events } from '../fisher-events';
import { Bank } from '../fisher-bank';
import { Archive } from './Archive';
import { Backpack } from '../fisher-backpack';
import { archiveStore } from './Constants';

class ArchiveHandler {
  public static logger = prefixLogger(prefixes.FISHER_CORE, 'ArchiveHandler');

  public activeArchive: Archive | undefined = undefined;

  public get hasActiveArchive() {
    return this.activeArchive !== undefined;
  }

  constructor() {
    makeAutoObservable(this);
    events.on(EventKeys.Update.BankUpdate, this.onBankUpdate);
    events.on(EventKeys.Update.BackpackUpdate, this.onBackpackUpdate);
  }

  public setActiveArchive = (archive: Archive) => {
    if (this.hasActiveArchive) {
      ArchiveHandler.logger.error(
        `Can not set active archvie, current active archive ${this.activeArchive!.archiveKey}`
      );
      throw new Error(`Can not set active archvie, current active archive ${this.activeArchive!.archiveKey}`);
    }

    this.activeArchive = archive;
    events.emit(EventKeys.Archive.LoadArchive, this.activeArchive.values, this.activeArchive);
  };

  public createNewArchive = async (masterName: string): Promise<[string, Archive]> => {
    ArchiveHandler.logger.info('Start create archive');

    const archive = Archive.create(masterName);
    await this.saveArchive(archive);

    ArchiveHandler.logger.info(`Success create archive ${archive.archiveKey}, master name ${masterName}`);
    return [archive.archiveKey, archive];
  };

  public deleteArchive = async (archive: Archive) => {
    archive.delete();
    await this.saveArchive(archive);
    ArchiveHandler.logger.info(`Success delete archive ${archive.archiveKey}`);
  };

  public exitActiveArchive = async () => {
    if (!this.hasActiveArchive) {
      ArchiveHandler.logger.error(`Current active archive was undefined can not exit`);
      throw new Error(`Current active archive was undefined can not exit`);
    }

    events.emit(EventKeys.Archive.ExitArchive, this.activeArchive);
    await this.saveArchive(this.activeArchive!);
    this.clearActiveArchive();
  };

  private onBankUpdate = (bank: Bank) => {
    this.checkActiveArchiveAvailable();

    this.activeArchive!.updateBank(bank.archive);
    this.saveActiveArchive();
  };

  private onBackpackUpdate = (backpack: Backpack) => {
    this.checkActiveArchiveAvailable();

    this.activeArchive!.updateBackpack(backpack.archive);
    this.saveActiveArchive();
  };

  private saveActiveArchive = async () => {
    this.checkActiveArchiveAvailable();
    return this.saveArchive(this.activeArchive!);
  };

  private saveArchive = async (archive: Archive) => {
    ArchiveHandler.logger.debug(`Save archive ${archive.archiveKey}`, archive.values);
    return await archiveStore.setItem(archive.archiveKey, archive.values);
  };

  private checkActiveArchiveAvailable = () => {
    if (!this.hasActiveArchive) {
      ArchiveHandler.logger.error(`Fail to update archive, active archive was undefined!`);
      throw new Error(`Fail to update archive, active archive was undefined!`);
    }
  };

  private clearActiveArchive = () => {
    this.activeArchive = undefined;
  };
}

export { ArchiveHandler };

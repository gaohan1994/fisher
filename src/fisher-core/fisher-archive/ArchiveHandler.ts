import { prefixes, prefixLogger } from '@FisherLogger';
import { EventKeys, events } from '../fisher-events';
import { Bank } from '../fisher-bank';
import { Archive } from './Archive';
import { Backpack } from '../fisher-backpack';
import { archiveStore } from './Constants';

class ArchiveHandler {
  public static logger = prefixLogger(prefixes.FISHER_CORE, 'ArchiveHandler');

  public activeArchive: Archive | undefined = undefined;

  constructor() {
    events.on(EventKeys.Update.BankUpdate, this.onBankUpdate);
    events.on(EventKeys.Update.BackpackUpdate, this.onBackpackUpdate);
  }

  public setActiveArchive = (value: Archive) => {
    const lastActiveArchive = this.activeArchive;
    if (lastActiveArchive !== undefined) {
      // @todo
      // clear last active archive stuff
    }

    this.activeArchive = value;
    if (this.activeArchive !== undefined) {
      events.emit(EventKeys.Archive.LoadArchive, this.activeArchive.values, this.activeArchive);
    } else {
      // do exsit stuff
    }
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
    if (this.activeArchive === undefined) {
      ArchiveHandler.logger.error(`Fail to update archive, active archive was undefined!`);
      throw new Error(`Fail to update archive, active archive was undefined!`);
    }
  };
}

export { ArchiveHandler };

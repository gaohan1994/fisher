import { makeAutoObservable } from 'mobx';
import { prefixes, prefixLogger } from '@fisher/logger';
import { EventKeys, events } from '@shared';
import { Bank } from '../fisher-bank';
import { Archive } from './Archive';
import { Backpack } from '../fisher-backpack';
import { archiveStore } from './Constants';
import { FisherCore } from '../fisher-core';

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
    this.loadArchive();
  };

  public loadArchive = () => {
    if (this.activeArchive === undefined) {
      throw new Error('Try to load undefined archive');
    }
    events.emit(EventKeys.Archive.LoadArchive, this.activeArchive.values, this.activeArchive);
  };

  public createNewArchive = async (masterName: string): Promise<[string, Archive]> => {
    ArchiveHandler.logger.info('Start create archive');

    const archive = Archive.create(masterName);
    await this.saveArchive(archive);

    ArchiveHandler.logger.info(`Success create archive ${archive.archiveKey}, master name ${masterName}`);
    return [archive.archiveKey, archive];
  };

  public saveFullArchive = async (core: FisherCore) => {
    if (this.checkActiveArchiveAvailable()) {
      const { bank, backpack, master, mining, reiki, forge, cook, battle, dungeon } = core;
      this.activeArchive!.updateBank(bank.archive);
      this.activeArchive!.updateBackpack(backpack.archive);
      this.activeArchive!.updateMaster(master.archive);
      this.activeArchive!.updateMining(mining.archive);
      this.activeArchive!.updateReiki(reiki.archive);
      this.activeArchive!.updateForge(forge.archive);
      this.activeArchive!.updateCook(cook.archive);
      this.activeArchive!.updateBattle(battle.archive);
      this.activeArchive!.updateDungeon(dungeon.archive);
      this.updateActiveComponentInfo(core);
      await this.saveActiveArchive();
    }
  };

  private updateActiveComponentInfo = (core: FisherCore) => {
    if (core.activeComponentId) {
      this.activeArchive!.updateActiveComponent(core.activeComponentId);
    } else {
      this.activeArchive!.clearActiveComponent();
    }
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

  private onBankUpdate = async (bank: Bank) => {
    if (this.checkActiveArchiveAvailable()) {
      this.activeArchive!.updateBank(bank.archive);
      await this.saveActiveArchive();
    }
  };

  private onBackpackUpdate = async (backpack: Backpack) => {
    if (this.checkActiveArchiveAvailable()) {
      this.activeArchive!.updateBackpack(backpack.archive);
      await this.saveActiveArchive();
    }
  };

  private saveActiveArchive = async () => {
    if (this.checkActiveArchiveAvailable()) {
      return await this.saveArchive(this.activeArchive!);
    }
  };

  private saveArchive = async (archive: Archive) => {
    ArchiveHandler.logger.debug(`Save archive ${archive.archiveKey}`, archive.values);
    return await archiveStore.setItem(archive.archiveKey, archive.values);
  };

  private checkActiveArchiveAvailable = () => {
    if (!this.hasActiveArchive) {
      ArchiveHandler.logger.error(`Fail to update archive, active archive was undefined!`);
      return false;
    }
    return true;
  };

  private clearActiveArchive = () => {
    this.activeArchive = undefined;
  };
}

export { ArchiveHandler };

import dayjs from 'dayjs';
import { generateTimestamp, randomString } from '../utils';
import { ArchiveInterface } from './Types';

class Archive {
  public archiveKey: string;

  public masterName: string;

  public createTime = dayjs().valueOf();

  public lastUpdateTime = dayjs().valueOf();

  public deletedAt: number | undefined = undefined;

  public get deleted() {
    return this.deletedAt !== undefined;
  }

  public activeComponentId: string | undefined = undefined;

  public activeComponentLastActiveTime: number | undefined = undefined;

  public bank: ArchiveInterface.ArchiveBank | undefined = undefined;

  public backpack: ArchiveInterface.ArchiveBackpack | undefined = undefined;

  public master: ArchiveInterface.ArchiveMaster | undefined = undefined;

  public mining: ArchiveInterface.ArchiveCollection | undefined = undefined;

  public reiki: ArchiveInterface.ArchiveCollection | undefined = undefined;

  public forge: ArchiveInterface.ArchiveCollection | undefined = undefined;

  public cook: ArchiveInterface.ArchiveCollection | undefined = undefined;

  public battle: ArchiveInterface.ArchiveBattle | undefined = undefined;

  public get values(): ArchiveInterface.ArchiveValues {
    return {
      activeComponentId: this.activeComponentId,
      activeComponentLastActiveTime: this.activeComponentLastActiveTime,
      archiveKey: this.archiveKey,
      masterName: this.masterName,
      createTime: this.createTime,
      lastUpdateTime: this.lastUpdateTime,
      deletedAt: this.deletedAt,
      bank: this.bank,
      backpack: this.backpack,
      master: this.master,
      mining: this.mining,
      reiki: this.reiki,
      forge: this.forge,
      cook: this.cook,
      battle: this.battle,
    };
  }

  constructor(options: ArchiveInterface.IArchive) {
    this.archiveKey = options.archiveKey;
    this.masterName = options.masterName;

    if (options.activeComponentId) {
      this.activeComponentId = options.activeComponentId;
    }

    if (options.activeComponentLastActiveTime) {
      this.activeComponentLastActiveTime = options.activeComponentLastActiveTime;
    }

    if (options.createTime) {
      this.createTime = options.createTime;
    }

    if (options.lastUpdateTime) {
      this.lastUpdateTime = options.lastUpdateTime;
    }

    if (options.deletedAt) {
      this.deletedAt = options.deletedAt;
    }

    if (options.bank) {
      this.bank = options.bank;
    }

    if (options.backpack) {
      this.backpack = options.backpack;
    }

    if (options.master) {
      this.master = options.master;
    }

    if (options.mining) {
      this.mining = options.mining;
    }

    if (options.reiki) {
      this.reiki = options.reiki;
    }

    if (options.forge) {
      this.forge = options.forge;
    }

    if (options.cook) {
      this.cook = options.cook;
    }

    if (options.battle) {
      this.battle = options.battle;
    }
  }

  public static create(masterName: string): Archive {
    const archiveKey = randomString(10) + '@' + `${generateTimestamp()}`;
    return new Archive({ archiveKey, masterName });
  }

  public updateBank = (value: ArchiveInterface.ArchiveBank) => {
    this.bank = value;
    this.refreshLastUpdateTime();
  };

  public updateBackpack = (value: ArchiveInterface.ArchiveBackpack) => {
    this.backpack = value;
    this.refreshLastUpdateTime();
  };

  public updateMaster = (value: ArchiveInterface.ArchiveMaster) => {
    this.master = value;
    this.refreshLastUpdateTime();
  };

  public updateMining = (value: ArchiveInterface.ArchiveCollection) => {
    this.mining = value;
    this.refreshLastUpdateTime();
  };

  public updateReiki = (value: ArchiveInterface.ArchiveCollection) => {
    this.reiki = value;
    this.refreshLastUpdateTime();
  };

  public updateForge = (value: ArchiveInterface.ArchiveCollection) => {
    this.forge = value;
    this.refreshLastUpdateTime();
  };

  public updateCook = (value: ArchiveInterface.ArchiveCollection) => {
    this.cook = value;
    this.refreshLastUpdateTime();
  };

  public updateBattle = (value: ArchiveInterface.ArchiveBattle) => {
    this.battle = value;
    this.refreshLastUpdateTime();
  };

  public delete = () => {
    this.deletedAt = generateTimestamp();
  };

  private refreshLastUpdateTime = () => {
    this.lastUpdateTime = generateTimestamp();
  };

  public updateActiveComponent = (compoenntId: string) => {
    this.activeComponentId = compoenntId;
    this.updateActiveComponentLastActiveTime();
  };

  public clearActiveComponent = () => {
    this.activeComponentId = undefined;
    this.updateActiveComponentLastActiveTime();
  };

  private updateActiveComponentLastActiveTime = () => {
    if (this.activeComponentId !== undefined) {
      this.activeComponentLastActiveTime = dayjs().unix() * 1000;
    } else {
      this.activeComponentLastActiveTime = undefined;
    }
  };
}

export { Archive };

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

  public bank?: ArchiveInterface.ArchiveBank | undefined = undefined;

  public backpack?: ArchiveInterface.ArchiveBackpack | undefined = undefined;

  public get values(): ArchiveInterface.ArchiveValues {
    return {
      archiveKey: this.archiveKey,
      masterName: this.masterName,
      createTime: this.createTime,
      lastUpdateTime: this.lastUpdateTime,
      deletedAt: this.deletedAt,
      bank: this.bank,
      backpack: this.backpack,
    };
  }

  constructor(options: ArchiveInterface.IArchive) {
    this.archiveKey = options.archiveKey;
    this.masterName = options.masterName;

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

  public delete = () => {
    this.deletedAt = generateTimestamp();
  };

  private refreshLastUpdateTime = () => {
    this.lastUpdateTime = generateTimestamp();
  };
}

export { Archive };

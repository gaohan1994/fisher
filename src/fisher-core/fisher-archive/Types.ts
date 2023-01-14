namespace ArchiveInterface {
  export interface ArchiveValues {
    archiveKey: string;
    masterName: string;
    createTime: number;
    lastUpdateTime: number;
    deletedAt?: number;
    bank?: ArchiveBank;
  }

  export interface ArchiveBank {
    gold: number;
  }

  export type ArchiveBackpack = Array<ArchiveBackpackItem>;

  interface ArchiveBackpackItem {
    id: string;
    quantity: number;
  }

  export interface IArchive extends Omit<ArchiveValues, 'createTime' | 'lastUpdateTime'> {
    createTime?: number;
    lastUpdateTime?: number;
  }
}

export type { ArchiveInterface };

namespace ArchiveInterface {
  export interface ArchiveValues {
    archiveKey: string;
    masterName: string;
    createTime: number;
    lastUpdateTime: number;
    deletedAt?: number;
    bank?: ArchiveBank;
    backpack?: ArchiveBackpack;
    master?: ArchiveMaster;
    mining?: ArchiveCollection;
    reiki?: ArchiveCollection;
    forge?: ArchiveCollection;
  }

  export interface ArchiveBank {
    gold: number;
  }

  export type ArchiveBackpack = Array<ArchiveBackpackItem>;

  export interface ArchiveCollection {
    experience: number;
  }

  export interface ArchiveMaster {
    experience: number;
    equipmentIds: string[];
    healPotionId: string | undefined;
  }

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

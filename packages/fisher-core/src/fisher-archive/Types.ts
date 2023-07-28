import { PotionVariant } from '@item';

namespace ArchiveInterface {
  export interface ArchiveValues {
    archiveKey: string;
    masterName: string;
    createTime: number;
    lastUpdateTime: number;
    activeComponentId: string | undefined;
    activeComponentLastActiveTime: number | undefined;
    deletedAt?: number;
    bank?: ArchiveBank;
    backpack?: ArchiveBackpack;
    master?: ArchiveMaster;
    mining?: ArchiveCollection;
    reiki?: ArchiveCollection;
    forge?: ArchiveCollection;
    cook?: ArchiveCollection;
    battle?: ArchiveBattle;
    dungeon?: ArchiveDungeon;
  }

  export interface ArchiveBank {
    gold: number;
  }

  export type ArchiveBackpack = Array<ArchiveBackpackItem>;

  export interface ArchiveBattle {
    activeEnemyId?: string;
  }

  export interface ArchiveDungeon {
    activeDungeonItemId?: string;
    progress?: number;
  }

  export interface ArchiveCollection {
    experience: number;
    activeRecipeId?: string;
  }

  export interface ArchiveMaster {
    Hp: number;
    experience: number;
    equipmentIds: string[];
    potionHandlers: ArchivePotionHandler[];
  }

  interface ArchiveBackpackItem {
    id: string;
    quantity: number;
  }

  export interface ArchivePotionHandler {
    variant: PotionVariant;
    potionId: string;
  }

  export interface IArchive
    extends Omit<
      ArchiveValues,
      'createTime' | 'lastUpdateTime' | 'activeComponentId' | 'activeComponentLastActiveTime'
    > {
    createTime?: number;
    lastUpdateTime?: number;
    activeComponentId?: string;
    activeComponentLastActiveTime?: number;
  }
}

export type { ArchiveInterface };

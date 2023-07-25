import localforage from 'localforage';

namespace ArchiveConstants {
  export const ArchiveKeyLength = 10;

  export namespace ArchiveManagerStore {
    export const StoreName = 'ArchiveManager';

    export enum StoreKeys {
      ActiveArchiveKey = 'ActiveArchiveKey',
    }
  }

  export namespace ArchiveStore {
    export const StoreName = 'Archive';
  }
}

const archiveStore = localforage.createInstance({ name: ArchiveConstants.ArchiveStore.StoreName });

export { archiveStore, ArchiveConstants };

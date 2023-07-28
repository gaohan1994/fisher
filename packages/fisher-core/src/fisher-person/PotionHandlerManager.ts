import { makeAutoObservable } from 'mobx';
import { ArchiveInterface } from '../fisher-archive';
import { PotionVariant } from '@item';
import { PotionHandler } from '../fisher-potion/PotionHandler';

class PotionHandlerArchiver {
  public hander: PotionHandler;
  constructor(handler: PotionHandler) {
    this.hander = handler;
  }

  public get archiveValue(): ArchiveInterface.ArchivePotionHandler | undefined {
    if (!this.hander.hasPotion) {
      return undefined;
    }
    return {
      variant: this.hander.potion!.item.variant,
      potionId: this.hander.potion!.item.id,
    };
  }
}

class PotionHandlerManager {
  public potionHandlerMap = new Map<PotionVariant, PotionHandler>();

  public get potionHandlerArchives(): ArchiveInterface.ArchivePotionHandler[] {
    let result: ArchiveInterface.ArchivePotionHandler[] = [];
    this.potionHandlerMap.forEach((potionHandler) => {
      const potionHandlerArchiver = new PotionHandlerArchiver(potionHandler);
      if (potionHandlerArchiver.archiveValue !== undefined) {
        result.push(potionHandlerArchiver.archiveValue);
      }
    });
    return result;
  }

  constructor() {
    this.initializePotionHandlerMap();
    makeAutoObservable(this);
  }

  private initializePotionHandlerMap = () => {
    for (const key in PotionVariant) {
      if (Object.prototype.hasOwnProperty.call(PotionVariant, key)) {
        const potionVariant = PotionVariant[key as PotionVariant];
        this.potionHandlerMap.set(potionVariant, new PotionHandler());
      }
    }
  };

  public loadArchivePotionHandlers = (potionHandlerArchives: ArchiveInterface.ArchivePotionHandler[]) => {
    for (let index = 0; index < potionHandlerArchives.length; index++) {
      const archive = potionHandlerArchives[index];
      const { variant, potionId } = archive;
      this.potionHandlerMap.get(variant)?.setPotionById(potionId);
    }
  };
}

export { PotionHandlerManager };

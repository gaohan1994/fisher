import { prefixLogger, prefixes } from '@FisherLogger';
import { Experience } from '../fisher-experience';
import { store } from '../fisher-packages';
import { ArchiveInterface } from '../fisher-archive';
import { makeAutoObservable } from 'mobx';

class Plant {
  static readonly logger = prefixLogger(prefixes.FISHER_CORE, 'Plant');

  public readonly id = 'Plant';

  public experience: Experience = new Experience();

  public get archive(): ArchiveInterface.ArchivePlant {
    return {
      experience: this.experience.experience,
      soils: [],
    };
  }

  public get soilPackage() {
    return store.PlantSoils;
  }

  constructor() {
    makeAutoObservable(this);
  }

  public soilConfig = {};

  public setSoilConfig = () => {};
}

export { Plant };

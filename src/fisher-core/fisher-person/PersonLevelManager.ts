import { makeAutoObservable } from 'mobx';
import { store } from '../fisher-packages';
import { PersonLevel, PersonLevelItem } from '../fisher-item';

export class PersonLevelManager {
  public levelItem: PersonLevelItem | undefined = undefined;

  constructor() {
    makeAutoObservable(this);
  }

  public get level() {
    return this.levelItem?.level;
  }

  public get state() {
    return this.levelItem?.state.name ?? '加载中';
  }

  public get name() {
    return this.levelItem?.name ?? '加载中';
  }

  public get coefficient(): number {
    return this.levelItem?.coefficient ?? 0;
  }

  public initialize = (level: PersonLevel) => {
    this.levelItem = store.findPersonLevelItem(level);
  };
}

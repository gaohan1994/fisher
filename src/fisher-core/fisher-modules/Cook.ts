import { Assets } from '../assets';
import { ArchiveInterface } from '../fisher-archive';
import { EventKeys, events } from '../fisher-events';
import { Recipe } from '../fisher-item';
import { store } from '../fisher-packages';
import { Skill } from '../fisher-skill';
import { Collection } from './Collection';

class Cook extends Collection<Recipe[]> {
  public static instance: Cook;

  public static create(): Cook {
    if (!Cook.instance) {
      Cook.instance = new Cook();
    }
    return Cook.instance;
  }

  public id = 'Cook';

  public name = '烹饪';

  public media = Assets.cook;

  public skill = new Skill(this.id);

  public get activeRecipeAvailable() {
    return this.skill.recipeHandler.activeRecipeAvailable;
  }

  public get packages() {
    return store.Cook;
  }

  constructor() {
    super();
    events.on(EventKeys.Archive.LoadArchive, this.onLoadArchive);
  }

  public onLoadArchive = (value: ArchiveInterface.ArchiveValues) => {
    this.skill.experience.setExperience(value.cook?.experience ?? 0);
  };

  public setActiveRecipe = (value: Recipe) => {
    this.skill.setActiveRecipe(value);
  };

  public start = () => {
    this.skill.start();
    events.emit(EventKeys.Core.SetActiveComponent, this);
  };

  public stop = () => {
    this.skill.stop();
  };
}

const cook = Cook.create();

export { cook, Cook };

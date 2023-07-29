import { Assets } from '../assets';
import { ArchiveInterface } from '../fisher-archive';
import { EventKeys, events } from '@shared';
import { Recipe } from '@item';
import { store } from '../fisher-packages';
import { Skill } from '@skill';
import { Collection } from './Collection';

class Forge extends Collection<Recipe[]> {
  public static instance: Forge;

  public static create(): Forge {
    if (!Forge.instance) {
      Forge.instance = new Forge();
    }
    return Forge.instance;
  }

  public id = 'Forge';

  public name = '锻造';

  public media = Assets.forge;

  public skill = new Skill(this.id);

  public get activeRecipeAvailable() {
    return this.skill.recipeHandler.activeRecipeAvailable;
  }

  public get packages() {
    return store.Forge;
  }

  public get ForgeRarityRecipeMap() {
    return store.ForgeRarityRecipeMap;
  }

  public get ForgeRarityRecipes() {
    return Array.from(store.ForgeRarityRecipeMap);
  }

  public get ForgeSlotCategoryRecipeMap() {
    return store.ForgeSlotCategoryRecipeMap;
  }

  public get ForgeSlotCategoryRecipes() {
    return Array.from(store.ForgeSlotCategoryRecipeMap);
  }

  public get ForgeBluePrints() {
    return store.ForgeBluePrints;
  }

  private constructor() {
    super();
    events.on(EventKeys.Archive.LoadArchive, this.onLoadArchive);
  }

  public onLoadArchive = (value: ArchiveInterface.ArchiveValues) => {
    this.skill.experience.setExperience(value.forge?.experience ?? 0);
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

export { Forge };

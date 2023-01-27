import { Assets } from '../assets';
import { EventKeys, events } from '../fisher-events';
import { Recipe } from '../fisher-item';
import { store } from '../fisher-packages';
import { Skill } from '../fisher-skill';
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

  public setActiveRecipe = (value: Recipe) => {
    this.skill.setActiveRecipe(value);
  };

  public start = () => {
    // before start froge module
    // the recipe must be availabled!
    if (!this.activeRecipeAvailable) {
      throw new Error(`Try to start froge but recipe unavailable: ${this.activeRecipe!.name}`);
    }

    this.skill.start();
    events.emit(EventKeys.Core.SetActiveComponent, this);
  };

  public stop = () => {
    this.skill.stop();
  };
}

const forge = Forge.create();

export { forge, Forge };

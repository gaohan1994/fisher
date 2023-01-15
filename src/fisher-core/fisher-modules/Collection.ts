import { Recipe } from '../fisher-item';
import { Skill } from '../fisher-skill';

abstract class Collection<CollectionPackages> {
  public abstract id: string;

  public abstract name: string;

  public abstract get packages(): CollectionPackages;

  public abstract skill: Skill;

  public get level() {
    return this.skill.skillExperience.level;
  }

  public get experience() {
    return this.skill.skillExperience.experience;
  }

  public get levelUpExperience() {
    return this.skill.skillExperience.levelUpExperience;
  }

  public get isActive() {
    return this.skill.timer.active;
  }

  public get activeRecipe() {
    return this.skill.recipeHandler.activeRecipe;
  }

  abstract start(recipe?: Recipe): void;

  abstract stop(): void;
}

export { Collection };

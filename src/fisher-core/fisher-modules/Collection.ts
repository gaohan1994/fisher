import { ArchiveInterface } from '../fisher-archive';
import { Recipe } from '../fisher-item';
import { Skill } from '../fisher-skill';

abstract class Collection<CollectionPackages> {
  public abstract id: string;

  public abstract name: string;

  public abstract get packages(): CollectionPackages;

  public abstract skill: Skill;

  public get archive(): ArchiveInterface.ArchiveCollection {
    return {
      experience: this.skill.experience.experience,
    };
  }

  public get level() {
    return this.skill.experience.level;
  }

  public get experience() {
    return this.skill.experience.experience;
  }

  public get levelUpExperience() {
    return this.skill.experience.levelUpExperience;
  }

  public get isActive() {
    return this.skill.timer.active;
  }

  public get activeRecipe() {
    return this.skill.recipeHandler.activeRecipe;
  }

  abstract start(recipe?: Recipe): void;

  abstract stop(): void;

  abstract onLoadArchive(value: ArchiveInterface.ArchiveValues): void;

  public addExperience = (value: number) => {
    this.skill.experience.addExperience(value);
  };

  public setExperience = (value: number) => {
    this.skill.experience.setExperience(value);
  };
}

export { Collection };

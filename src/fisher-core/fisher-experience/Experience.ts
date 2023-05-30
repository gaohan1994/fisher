import { makeAutoObservable } from 'mobx';
import { experienceCalculator, MaxLevel } from './ExperienceCalculator';

class Experience {
  public static readonly MaxLevel = MaxLevel;

  public experience = 0;

  public get maxLevel() {
    return MaxLevel;
  }

  public get level() {
    let result = 1;

    while (experienceCalculator.getLevelExperience(result) <= this.experience) {
      if (result >= MaxLevel) {
        break;
      }

      result++;
    }

    return result;
  }

  public get levelUpExperience() {
    return experienceCalculator.getLevelExperience(this.level);
  }

  constructor() {
    makeAutoObservable(this);
  }

  public addExperience = (value: number) => {
    this.experience += value;
  };

  public setExperience = (value: number) => {
    this.experience = value;
  };

  public setLevel = (level: number) => {
    const correctLevel = Math.min(MaxLevel, level);
    const levelExperience = experienceCalculator.getLevelExperience(correctLevel);
    this.addExperience(levelExperience);
  };
}

export { Experience };

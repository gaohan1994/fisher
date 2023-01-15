import { makeAutoObservable } from 'mobx';
import { skillExperienceCalculator, MaxLevel } from './ExperienceCalculator';

class SkillExperience {
  public experience = 0;

  public get level() {
    let result = 1;

    while (skillExperienceCalculator.getLevelExperience(result) <= this.experience) {
      if (result >= MaxLevel) {
        break;
      }

      result++;
    }

    return result;
  }

  public get levelUpExperience() {
    return skillExperienceCalculator.getLevelExperience(this.level);
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
}

export { SkillExperience };

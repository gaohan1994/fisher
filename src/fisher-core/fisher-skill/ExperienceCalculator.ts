const MaxLevel = 99;

class SkillExperienceCalculator {
  public static MaxLevel = MaxLevel;

  public static instance: SkillExperienceCalculator;

  public static create(): SkillExperienceCalculator {
    if (!SkillExperienceCalculator.instance) {
      SkillExperienceCalculator.instance = new SkillExperienceCalculator();
    }
    return SkillExperienceCalculator.instance;
  }

  private skillLevelExperienceMap = new Map<number, number>();

  public get skillLevelExperienceList() {
    return [...this.skillLevelExperienceMap];
  }

  constructor() {
    for (let index = 0; index <= SkillExperienceCalculator.MaxLevel; index++) {
      let currentLevelUpExperience: number;

      if (index <= 30) {
        currentLevelUpExperience = 20 * Math.pow(index, 2) + 80 * index;
      } else if (index <= 50) {
        currentLevelUpExperience = 40 * Math.pow(index, 2) - 140 * index + 100;
      } else if (index <= 60) {
        currentLevelUpExperience = 40 * Math.pow(index, 2) + 360 * index;
      } else {
        currentLevelUpExperience = Math.pow(index, 3) + 400 * index;
      }

      this.skillLevelExperienceMap.set(index, currentLevelUpExperience);
    }
  }

  public getLevelExperience = (level: number) => {
    return this.skillLevelExperienceMap.get(level) ?? 0;
  };
}

const skillExperienceCalculator = SkillExperienceCalculator.create();

export { skillExperienceCalculator, MaxLevel };

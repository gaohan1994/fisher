const MaxLevel = 40;

class ExperienceCalculator {
  public static MaxLevel = MaxLevel;

  public static instance: ExperienceCalculator;

  public static create(): ExperienceCalculator {
    if (!ExperienceCalculator.instance) {
      ExperienceCalculator.instance = new ExperienceCalculator();
    }
    return ExperienceCalculator.instance;
  }

  private levelExperienceMap = new Map<number, number>();

  public get levelExperienceList() {
    return [...this.levelExperienceMap];
  }

  constructor() {
    for (let index = 0; index <= ExperienceCalculator.MaxLevel; index++) {
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

      this.levelExperienceMap.set(index, currentLevelUpExperience);
    }
  }

  public getLevelExperience = (level: number) => {
    return this.levelExperienceMap.get(level) ?? 0;
  };
}

const experienceCalculator = ExperienceCalculator.create();

export { experienceCalculator, ExperienceCalculator, MaxLevel };

const SKILL_MAX_LEVEL = 99;

class ExperienceConfig {
  private static _instance: ExperienceConfig;
  public config: Array<number> = [];

  constructor() {
    this.initialize();
  }

  /**
   * 单例模式
   *
   * @static
   * @memberof ExperienceConfig
   */
  public static instance = () => {
    if (this._instance) {
      return this._instance;
    }
    this._instance = new ExperienceConfig();
    return this._instance;
  };

  public initialize = () => {
    for (let index = 1; index <= SKILL_MAX_LEVEL; index++) {
      if (index <= 30) {
        // 1 - 30 级
        // y = 20 * x^2 + 80 * x - 100
        const currentExperience = 20 * Math.pow(index, 2) + 80 * index - 100;
        this.config.push(currentExperience);
      } else if (index <= 50) {
        // 31 - 50 级
        // y = 40 * x^2 - 140 * x + 100
        const currentExperience = 40 * Math.pow(index, 2) - 140 * index + 100;
        this.config.push(currentExperience);
      } else if (index <= 60) {
        // 51 - 60 级
        // y = 40 * x^2 + 360 * x
        const currentExperience = 40 * Math.pow(index, 2) + 360 * index;
        this.config.push(currentExperience);
      } else if (index <= 80) {
      }
    }
  };
}

export const experienceConfig = ExperienceConfig.instance();

/**
 * 计算传入经验对应的等级
 *
 * @param {number} experience
 * @return {*}  {number}
 */
export function calculateExperienceToLevel(experience: number): number {
  let level = 1;
  while (calculateLevelToExperience(level) < experience) {
    level++;
  }
  return level;
}

/**
 * 计算传入等级所需经验
 *
 * @param {number} level
 * @return {*}  {number}
 */
export function calculateLevelToExperience(level: number): number {
  const { config } = experienceConfig;
  return config[level];
}

interface NextLevelExperienceConfig {
  currentLevel: number;
  currentLevelExperience: number;
  nextLevel: number;
  nextLevelExperience: number;
  // 当前等级到下一等级的经验值
  remainingExperience: number;
}

/**
 * 计算下一等级需要的技能配置
 *
 * @param {number} currentLevel
 */
export function calculateNextLevelExperienceConfig(
  currentLevel: number
): NextLevelExperienceConfig {
  const nextLevel = currentLevel + 1;
  const currentLevelExperience = calculateLevelToExperience(currentLevel);
  const nextLevelExperience = calculateLevelToExperience(nextLevel);
  const remainingExperience = nextLevelExperience - currentLevelExperience;
  return {
    currentLevel,
    currentLevelExperience,
    nextLevel,
    nextLevelExperience,
    remainingExperience,
  };
}

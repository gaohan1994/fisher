import invariant from 'invariant';

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
  while (calculateLevelToExperience(level) <= experience) {
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
  invariant(
    level <= config.length - 1,
    'Fail to calculate level, out of max level 99: ' + level
  );
  return config[level];
}

export interface LevelExperienceInfo {
  level: number;
  experience: number;
  // 当前等级升级到下一级需要的总经验
  totalExperienceToLevelUp: number;
  // 当前经验升到下一等级还需要的经验值
  remainingExperienceToLevelUp: number;
}

/**
 * 计算技能经验等级相关信息
 *
 * @param {number} currentLevel
 */
export function calculateLevelExperienceInfo(
  experience: number
): LevelExperienceInfo {
  const level = calculateExperienceToLevel(experience);
  const totalExperienceToLevelUp = calculateLevelToExperience(level);
  const remainingExperienceToLevelUp = totalExperienceToLevelUp - experience;
  return {
    level,
    experience,
    totalExperienceToLevelUp,
    remainingExperienceToLevelUp,
  };
}

import { Experience } from '@FisherCore';
import { FuiColor } from '../theme';

/**
 * Return current level / max level string
 * @param experience
 * @returns
 */
export const useLevelLabel = (experience: Experience) => {
  return `${experience.level} / ${experience.maxLevel}`;
};

/**
 * Return current experience / level up experience string
 * @param experience
 * @returns
 */
export const useExperienceLabel = (experience: Experience) => {
  return `${experience.experience} / ${experience.levelUpExperience}`;
};

/**
 * Return level color
 * @param level
 * @returns
 */
export const useLevelColor = (level: string | number) => {
  const realLevel = Number(level);

  if (realLevel >= Experience.MaxLevel) {
    return { color: FuiColor.priamryOrange };
  }

  if (realLevel >= Experience.MaxLevel - 10) {
    return { color: FuiColor.primaryPurple };
  }

  if (realLevel >= Experience.MaxLevel - 20) {
    return { color: FuiColor.primaryBlue };
  }

  if (realLevel >= Experience.MaxLevel - 30) {
    return { color: FuiColor.primaryGreen };
  }

  return { color: FuiColor.common.white };
};

import { Experience } from '@FisherCore';
import { FuiColor } from '../theme';

const useLevelColor = (level: string | number) => {
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

export { useLevelColor };

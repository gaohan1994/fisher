import { PersonMode } from '@FisherCore';
import { FuiColor } from '../theme';

const usePersonModeColor = (mode: PersonMode) => {
  if (mode === PersonMode.CommonEnemy) {
    return { color: FuiColor.primaryGreen };
  }

  if (mode === PersonMode.EliteEnemy) {
    return { color: FuiColor.primaryBlue };
  }

  if (mode === PersonMode.LegendaryEnemy) {
    return { color: FuiColor.priamryOrange };
  }

  return { color: FuiColor.common.white };
};

export { usePersonModeColor };

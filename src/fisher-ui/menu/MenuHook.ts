import { ComponentId, Experience, FisherComponent, Timer } from '@FisherCore';
import { FuiColor } from '../theme';
import { blue } from '@mui/material/colors';

const useComponentLevelColor = (level: string | number) => {
  const realLevel = Number(level);

  if (realLevel >= Experience.MaxLevel) {
    return { color: FuiColor.gold };
  }

  if (realLevel >= Experience.MaxLevel / 2) {
    return { color: FuiColor.green };
  }

  if (realLevel >= 10) {
    return { color: blue[400] };
  }

  return { color: FuiColor.common.white };
};

const useComponentTimer = (component: FisherComponent): Timer | undefined => {
  if ((component as any).skill !== undefined) {
    return (component as any).skill.timer;
  }

  if (component.id === ComponentId.Battle || component.id === ComponentId.Dungeon) {
    return (component as any).master.person.actionManager.timer;
  }

  return undefined;
};

export { useComponentLevelColor, useComponentTimer };

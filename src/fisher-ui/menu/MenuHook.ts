import { ComponentId, FisherComponent, Timer, core } from '@FisherCore';

const useComponentTimer = (component: FisherComponent): Timer | undefined => {
  if ((component as any).skill !== undefined) {
    return (component as any).skill.timer;
  }

  if (component.id === ComponentId.Battle || component.id === ComponentId.Dungeon) {
    return core.master.actionManager.attackActionTimer;
  }

  return undefined;
};

export { useComponentTimer };

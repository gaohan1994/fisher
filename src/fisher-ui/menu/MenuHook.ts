import { ComponentId, FisherComponent, Timer } from '@FisherCore';

const useComponentTimer = (component: FisherComponent): Timer | undefined => {
  if ((component as any).skill !== undefined) {
    return (component as any).skill.timer;
  }

  if (component.id === ComponentId.Battle || component.id === ComponentId.Dungeon) {
    return (component as any).master.person.actionManager.timer;
  }

  return undefined;
};

export { useComponentTimer };

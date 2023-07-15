import { ComponentId, FisherComponent, Timer } from '@FisherCore';
import { useActiveComponent, useComponentManager, useMaster } from '../../core';

const visibleComponentIds = [
  ComponentId.Master,
  ComponentId.Bank,
  ComponentId.Battle,
  ComponentId.Mining,
  ComponentId.Reiki,
  ComponentId.Forge,
  ComponentId.Cook,
  ComponentId.Dungeon,
];

/**
 * Return the [componentId, Component] array
 * Note only return components which should visible on the menu
 * @returns
 */
export const useVisibleComponentMenu = (): [ComponentId, FisherComponent][] => {
  const componentManager = useComponentManager();
  return visibleComponentIds.map((id) => [id, componentManager.componentMap.get(id)!]);
};

/**
 * Return the component menu path
 * @param component
 * @returns
 */
export const useComponentMenuPath = (component: FisherComponent) => {
  return component.id.toLocaleLowerCase();
};

/**
 * Return true if activeComponent wan not undefined and
 * activeComponent's id equal passed component's id
 * @param component
 * @returns
 */
export const useIsComponentActive = (component: FisherComponent): boolean => {
  const activeComponent = useActiveComponent();
  return activeComponent !== undefined && activeComponent.id === component.id;
};

/**
 * Return passed component module timer
 * @param component
 * @returns
 */
export const useComponentTimer = (component: FisherComponent): Timer | undefined => {
  const master = useMaster();

  if ((component as any).skill !== undefined) {
    return (component as any).skill.timer;
  }

  if (component.id === ComponentId.Battle || component.id === ComponentId.Dungeon) {
    return master.actionManager.attackActionTimer;
  }

  return undefined;
};

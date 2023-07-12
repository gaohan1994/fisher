import { useCore } from '../../core';

/**
 * Return game version as string
 * @returns
 */
export const useGameVersion = () => {
  const core = useCore();
  return `v${core.version}`;
};

const DefaultActiveComponentName = '无';
/**
 * Return the current active component module name
 * If undefined return default active component name as '无'
 * @returns
 */
export const useActiveComponentName = () => {
  const { activeComponent } = useCore();
  return activeComponent !== undefined ? activeComponent.name : DefaultActiveComponentName;
};

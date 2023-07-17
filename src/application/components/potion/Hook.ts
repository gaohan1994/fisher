import { useMaster } from '../../core';

/**
 * Return master heal potion handler
 * @returns
 */
export const useHealPotionHandler = () => {
  const master = useMaster();
  return master.healPotionHandler;
};

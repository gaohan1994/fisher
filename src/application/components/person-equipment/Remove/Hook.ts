import { useMaster } from '../../../core';

/**
 * Return master person equipment manager
 * @returns
 */
export const useMasterPersonEquipmentManager = () => {
  const { personEquipmentManager } = useMaster();
  return personEquipmentManager;
};

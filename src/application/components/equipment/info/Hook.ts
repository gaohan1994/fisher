import { EquipmentItem, EquipmentSlotName } from '@FisherCore';

/**
 * Return equipment slot name
 * @param equipment
 * @returns
 */
export const useEquipmentSlotName = (equipment: EquipmentItem) => {
  return EquipmentSlotName[equipment.slot];
};

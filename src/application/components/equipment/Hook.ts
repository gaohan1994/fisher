import { useMemo } from 'react';
import { ActionId, EquipmentItem, FisherActions, store } from '@FisherCore';

/**
 * Return passed equipment all attributes
 * @param equipment
 * @returns
 */
export const useEquipmentAttributes = (equipment: EquipmentItem) =>
  useMemo(() => (equipment.hasAttributes ? equipment.attributes : []), [equipment.id]);

/**
 * Return equipment all actions
 * @param equipment
 */
export const useEquipmentActions = (equipment: EquipmentItem) => {
  const { actionIds } = equipment;
  return useMemo(() => actionIds.map((actionId) => new FisherActions[actionId as ActionId]()), [equipment.id]);
};

/**
 * Return passed equipment set and include equipments
 * @param equipment
 * @returns
 */
export const useEquipmentSet = (equipment: EquipmentItem) => {
  const { hasEquipmentSet, equipmentSetId } = equipment;
  if (!hasEquipmentSet) return null;
  return useMemo(() => store.findEquipmentSetById(equipmentSetId!), [equipmentSetId]);
};

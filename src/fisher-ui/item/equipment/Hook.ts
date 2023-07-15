import { useMemo } from 'react';
import { ActionId, EquipmentItem, EquipmentSet, FisherActions, store } from '@FisherCore';

/**
 * Return passed equipment all attributes
 * @param equipment
 * @returns
 */
export const useEquipmentAttributes = (equipment: EquipmentItem) =>
  useMemo(() => (equipment.hasAttributes ? equipment.attributes : []), [equipment.id]);

/**
 * Return passed equipment if has equipment set
 * @param equipment
 * @returns
 */
export const useHasEquipmentSet = (equipment: EquipmentItem) => useMemo(() => equipment.hasEquipmentSet, [equipment]);

/**
 * Return passed equipment set and include equipments
 * @param equipment
 * @returns
 */
export const useEquipmentSet = (equipment: EquipmentItem) => {
  const { hasEquipmentSet, equipmentSetId } = equipment;
  if (!hasEquipmentSet) {
    throw new Error(`Try to use equipment set with wrong equipment data! ${equipment.id}`);
  }

  return useMemo(() => store.findEquipmentSetById(equipmentSetId!), [equipmentSetId]);
};

/**
 * Return equipment set include equipments and if current equipment active
 * @param equipmentSet
 * @returns
 */
export const useEquipmentSetIncludeEquipments = (equipmentSet: EquipmentSet) => {
  const { equipmentIds } = equipmentSet;
  return equipmentIds.map((id) => {
    const equipment = store.findEquipmentById(id);
    const equipmentActive = equipmentSet.checkEquipmentIsActive(equipment);
    return [equipment, equipmentActive] as const;
  });
};

/**
 * Return equipment all actions
 * @param equipment
 */
export const useEquipmentActions = (equipment: EquipmentItem) => {
  const { actionIds } = equipment;

  if (actionIds.length === 0) {
    throw new Error(`Try to use equipment actions wrong equipment data! ${equipment.id}`);
  }

  return useMemo(() => actionIds.map((actionId) => new FisherActions[actionId as ActionId]()), [equipment.id]);
};

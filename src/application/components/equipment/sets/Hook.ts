import { EquipmentSet, store } from '@FisherCore';

/**
 * Return active equipments / total set equipments
 * @param equipmentSet
 * @returns
 */
export const useSetActiveEquipmentsDisplayValue = (equipmentSet: EquipmentSet) => {
  const {
    activeEquipmentLength,
    equipmentIdSet: { size },
  } = equipmentSet;
  return `(${activeEquipmentLength}/${size})`;
};

/**
 * Return all set include equipments
 * @param equipmentSet
 * @returns
 */
export const useSetIncludeEquipments = (equipmentSet: EquipmentSet) => {
  const { equipmentIds } = equipmentSet;
  return equipmentIds.map((id) => {
    const equipment = store.findEquipmentById(id);
    const equipmentActive = equipmentSet.checkEquipmentIsActive(equipment);
    return [equipment, equipmentActive] as const;
  });
};

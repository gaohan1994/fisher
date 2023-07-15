import { Person } from '@FisherCore';

/**
 * Return person equipment columns
 * @param person
 * @returns
 */
export const usePersonEquipmentColumns = (person: Person) => {
  const { personEquipmentManager } = person;
  const leftEquipments = [
    personEquipmentManager.primaryWeapon,
    personEquipmentManager.jacket,
    personEquipmentManager.belt,
  ];
  const rightEquipments = [
    personEquipmentManager.secondaryWeapon,
    personEquipmentManager.vest,
    personEquipmentManager.Shoe,
  ];

  const leftJewelryEquipments = [
    personEquipmentManager.helmet,
    personEquipmentManager.necklace,
    personEquipmentManager.earring,
  ];
  const rightJewelryEquipments = [
    personEquipmentManager.handGuard,
    personEquipmentManager.ring,
    personEquipmentManager.bracelet,
  ];
  return [leftEquipments, rightEquipments, leftJewelryEquipments, rightJewelryEquipments];
};

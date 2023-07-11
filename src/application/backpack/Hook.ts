import { useMemo } from 'react';
import { BackpackItem, EquipmentItem, EquipmentSlot, ItemType } from '@FisherCore';
import { useBackpack } from '../core';

/**
 * Return all equipment slot array
 * @returns
 */
export const useEquipmentSlots = () =>
  useMemo(() => {
    const result = [];

    for (const slot in EquipmentSlot) {
      result.push(slot);
    }

    return result;
  }, [EquipmentSlot]);

/**
 * Return [EquipmentSlot, BackpackItem<EquipmentItem>[]] to render
 * @returns
 */
export const useBackpackEquipmentsBySlot = (slots: string[]) => {
  const backpack = useBackpack();
  const backpackEquipmentList = backpack.getItemsByType<EquipmentItem>(ItemType.Equipment);
  const backpackEquipmentMap = new Map<EquipmentSlot, BackpackItem<EquipmentItem>[]>();

  slots.forEach((slot) => backpackEquipmentMap.set(slot as EquipmentSlot, []));

  for (let index = 0; index < backpackEquipmentList.length; index++) {
    const backpackItem = backpackEquipmentList[index];
    const { item } = backpackItem;

    if (!backpackEquipmentMap.has(item.slot)) {
      throw new Error(`Unhandled equipment slot: ${item.slot}`);
    }

    const currentSlotEquipments = backpackEquipmentMap.get(item.slot) || [];
    currentSlotEquipments.push(backpackItem);
    backpackEquipmentMap.set(item.slot, currentSlotEquipments);
  }

  return Array.from(backpackEquipmentMap);
};

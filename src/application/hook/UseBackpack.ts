import React from 'react';
import { BackpackItem, core, EquipmentItem, EquipmentSlot, ItemType } from '@FisherCore';

const UseBackpack = () => {
  const { backpack } = core;
  const { backpackItems } = backpack;

  const backpackEquipmentMap = new Map<EquipmentSlot, BackpackItem<EquipmentItem>[]>();
  const backpackEquipmentList = backpack.getItemsByType<EquipmentItem>(ItemType.Equipment);

  for (let index = 0; index < backpackEquipmentList.length; index++) {
    const backpackItem = backpackEquipmentList[index];
    const { item } = backpackItem;

    if (backpackEquipmentMap.has(item.slot)) {
      const currentSlotEquipments = backpackEquipmentMap.get(item.slot) || [];
      currentSlotEquipments.push(backpackItem);
      backpackEquipmentMap.set(item.slot, currentSlotEquipments);
    } else {
      backpackEquipmentMap.set(item.slot, [backpackItem]);
    }
  }
  return {};
};

export { UseBackpack };

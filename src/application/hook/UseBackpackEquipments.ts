import React from 'react';
import { BackpackItem, core, EquipmentItem, EquipmentSlot, ItemType } from '@FisherCore';

const useBackpackEquipments = () => {
  const { backpack, master } = core;

  const backpackEquipmentList = backpack.getItemsByType<EquipmentItem>(ItemType.Equipment);
  const backpackEquipmentMap = new Map<EquipmentSlot, BackpackItem<EquipmentItem>[]>();

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

  const getBackpackSlotEquipments = React.useCallback(
    (slot: EquipmentSlot) => backpackEquipmentMap.get(slot) ?? [],
    [backpackEquipmentMap]
  );

  const masterUseBackpackEquipment = React.useCallback((equipment: EquipmentItem) => {
    master.personEquipmentManager.useEquipment(equipment);
  }, []);

  return {
    backpackEquipmentList,
    getBackpackSlotEquipments,
    masterUseBackpackEquipment,
  };
};

export { useBackpackEquipments };

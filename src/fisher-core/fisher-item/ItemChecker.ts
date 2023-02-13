import { EquipmentItem } from './EquipmentItem';
import { Item } from './Item';

const isEquipmentItem = (item: Item | EquipmentItem): item is EquipmentItem => {
  return item instanceof EquipmentItem;
};

export { isEquipmentItem };

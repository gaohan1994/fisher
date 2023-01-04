import { EquipmentItem, IEquipmentItem } from '../fisher-item';
import EquipmentsJson from './data/EquipmentData.json';

export const EmptyEquipment = new EquipmentItem(
  EquipmentsJson.data.emptyEquipment as IEquipmentItem
);

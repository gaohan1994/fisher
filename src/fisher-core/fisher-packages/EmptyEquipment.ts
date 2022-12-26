import { FisherEquipmentItem, IFisherEquipmentItem } from '../fisher-item';
import EquipmentsJson from './data/EquipmentData.json';

export const EmptyEquipment = new FisherEquipmentItem(
  EquipmentsJson.data.emptyEquipment as IFisherEquipmentItem
);

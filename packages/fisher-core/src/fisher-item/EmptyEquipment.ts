import { Assets } from '@assets';
import { EquipmentSlot, EquipmentSlotName } from './Constants.js';
import { ItemType, AbstractItem } from './Item.js';

class EmptyEquipment extends AbstractItem {
  public type = ItemType.Equipment;

  public slot: EquipmentSlot;

  public desc = '';

  public price = 0;

  constructor(slot: EquipmentSlot[number]) {
    super();
    this.slot = slot as EquipmentSlot;
    this.name = `${EquipmentSlotName[this.slot]}-空`;
    this.id = 'Empty' + this.slot;
    this.media = Assets[this.id as keyof typeof Assets];
  }
}

export { EmptyEquipment };

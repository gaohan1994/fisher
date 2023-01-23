/**
 * 可装备槽位
 *
 * @export
 * @enum {number}
 */
enum EquipmentSlot {
  Weapon = 'Weapon',
  Helmet = 'Helmet',
}

const EquipmentSlotName = {
  [EquipmentSlot.Helmet]: '头盔',
  [EquipmentSlot.Weapon]: '武器',
};

export { EquipmentSlot, EquipmentSlotName };

/**
 * 可装备槽位
 *
 * @export
 * @enum {number}
 */
enum EquipmentSlot {
  PrimaryWeapon = 'PrimaryWeapon',
  SecondaryWeapon = 'SecondaryWeapon',
  Helmet = 'Helmet',
}

const EquipmentSlotName = {
  [EquipmentSlot.Helmet]: '头盔',
  [EquipmentSlot.PrimaryWeapon]: '主武器',
  [EquipmentSlot.SecondaryWeapon]: '副武器',
};

export { EquipmentSlot, EquipmentSlotName };

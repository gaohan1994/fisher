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
  Jacket = 'Jacket',
  Vest = 'Vest',
  Shoe = 'Shoe',
  HandGuard = 'HandGuard',
  Belt = 'Belt',
  Necklace = 'Necklace',
  Earring = 'Earring',
  Ring = 'Ring',
  Bracelet = 'Bracelet',
}

const EquipmentSlotName = {
  [EquipmentSlot.Helmet]: '头盔',
  [EquipmentSlot.PrimaryWeapon]: '主武器',
  [EquipmentSlot.SecondaryWeapon]: '副武器',
  [EquipmentSlot.Jacket]: '胸甲',
  [EquipmentSlot.Vest]: '背心',
  [EquipmentSlot.Shoe]: '鞋子',
  [EquipmentSlot.HandGuard]: '护手',
  [EquipmentSlot.Belt]: '腰带',
  [EquipmentSlot.Necklace]: '项链',
  [EquipmentSlot.Earring]: '耳环',
  [EquipmentSlot.Ring]: '戒指',
  [EquipmentSlot.Bracelet]: '手镯',
};

export { EquipmentSlot, EquipmentSlotName };

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

enum Rarity {
  Common = 'Common',
  Rare = 'Rare',
  Epic = 'Epic',
  Legendary = 'Legendary',
}

const RarityName = {
  [Rarity.Common]: '普通',
  [Rarity.Rare]: '稀有',
  [Rarity.Epic]: '史诗',
  [Rarity.Legendary]: '传说',
};

const EquipmentSlotName = {
  [EquipmentSlot.PrimaryWeapon]: '主武器',
  [EquipmentSlot.SecondaryWeapon]: '副武器',
  [EquipmentSlot.Helmet]: '头盔',
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

enum PotionVariant {
  HealPotion = 'HealPotion',
  AttributePotion = 'AttributePotion',
}

const PotionVariantName = {
  [PotionVariant.HealPotion]: '恢复药水',
  [PotionVariant.AttributePotion]: '属性药水',
};

export { EquipmentSlot, EquipmentSlotName, PotionVariant, PotionVariantName, Rarity, RarityName };

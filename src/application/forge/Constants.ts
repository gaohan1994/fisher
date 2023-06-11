enum ForgeTabCategories {
  Rarity,
  Slot,
  EquipmentSet,
}

const ForgeTabCategoryName = {
  [ForgeTabCategories.EquipmentSet]: '按套装划分图纸',
  [ForgeTabCategories.Rarity]: '按稀有度划分图纸',
  [ForgeTabCategories.Slot]: '按种类划分图纸',
};

export { ForgeTabCategories, ForgeTabCategoryName };

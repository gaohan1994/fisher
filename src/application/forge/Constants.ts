enum ForgeTabCategories {
  All,
  Rarity,
  Slot,
  EquipmentSet,
}

const ForgeTabCategoryName = {
  [ForgeTabCategories.All]: '全部图纸',
  [ForgeTabCategories.EquipmentSet]: '套装图纸',
  [ForgeTabCategories.Rarity]: '按稀有度划分图纸',
  [ForgeTabCategories.Slot]: '按种类划分图纸',
};

export { ForgeTabCategories, ForgeTabCategoryName };

import { EquipmentSet, EquipmentSlotName, ItemType, RarityName, Recipe, store } from '@FisherCore';
import { useForge } from '../core';
import { CategoryNode, CategoryNodeData, ForgeTabCategories } from './Constants';

/**
 * Return all category recipes
 * @param activeCategory
 */
export const useForgeCategoies = (): CategoryNode[] => {
  const { ForgeRarityRecipes, ForgeSlotCategoryRecipes, packages } = useForge();
  const equipmentSetCategoryData = useEquipmentSetCategoryData(packages);

  const rarityCategoryData: CategoryNodeData[] = ForgeRarityRecipes.map(([rarity, recipes]) => ({
    summary: RarityName[rarity],
    recipes,
  }));

  const equipmentSlotCategoryData: CategoryNodeData[] = ForgeSlotCategoryRecipes.map(([equipmentSlot, recipes]) => ({
    summary: EquipmentSlotName[equipmentSlot],
    recipes,
  }));

  return [
    new CategoryNode(ForgeTabCategories.EquipmentSet, equipmentSetCategoryData),
    new CategoryNode(ForgeTabCategories.Rarity, rarityCategoryData),
    new CategoryNode(ForgeTabCategories.Slot, equipmentSlotCategoryData),
  ];
};

const useEquipmentSetCategoryData = (recipes: Recipe[]): CategoryNodeData[] => {
  const equipmentSetCategoryRecipeMap = new Map<EquipmentSet, Recipe[]>();

  recipes.forEach((recipe) => {
    const equipmentItems = recipe.rewardItems
      .map((item) => store.findEquipmentById(item.itemId))
      .filter((item) => item.type === ItemType.Equipment);

    equipmentItems.forEach((equipment) => {
      if (equipment.hasEquipmentSet) {
        const equipmentSet = store.findEquipmentSetById(equipment.equipmentSetId!);
        const equipmentSetRecipes = equipmentSetCategoryRecipeMap.get(equipmentSet) ?? [];
        equipmentSetRecipes.push(recipe);
        equipmentSetCategoryRecipeMap.set(equipmentSet, equipmentSetRecipes);
      }
    });
  });

  return [...equipmentSetCategoryRecipeMap].map(([set, recipes]) => ({
    summary: set.name,
    recipes,
  }));
};

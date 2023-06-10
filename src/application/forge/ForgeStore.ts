import { makeAutoObservable } from 'mobx';
import { EquipmentSet, Forge, ItemType, Recipe, store } from '@FisherCore';
import { ForgeRecipeTabCategory } from './ForgeCategory';
import { ForgeTabCategories } from './Constants';

class ForgeStore {
  public recipes: Recipe[];

  public equipmentSetCategoryRecipeMap = new Map<EquipmentSet, Recipe[]>();

  public get equipmentSetCategoryRecipes() {
    return Array.from(this.equipmentSetCategoryRecipeMap);
  }

  public recipeTabs = [
    new ForgeRecipeTabCategory(ForgeTabCategories.All),
    new ForgeRecipeTabCategory(ForgeTabCategories.Rarity),
    new ForgeRecipeTabCategory(ForgeTabCategories.Slot),
    new ForgeRecipeTabCategory(ForgeTabCategories.EquipmentSet),
  ];

  public activeRecipeTab: ForgeTabCategories = ForgeTabCategories.All;

  constructor(forge: Forge) {
    makeAutoObservable(this);
    const { packages: recipes } = forge;

    this.recipes = recipes;

    recipes.forEach((recipe) => {
      const equipmentItems = recipe.rewardItems
        .map((item) => store.findEquipmentById(item.itemId))
        .filter((item) => item.type === ItemType.Equipment);

      equipmentItems.forEach((equipment) => {
        if (equipment.hasEquipmentSet) {
          const equipmentSet = store.findEquipmentSetById(equipment.equipmentSetId!);
          const equipmentSetRecipes = this.equipmentSetCategoryRecipeMap.get(equipmentSet) ?? [];
          equipmentSetRecipes.push(recipe);
          this.equipmentSetCategoryRecipeMap.set(equipmentSet, equipmentSetRecipes);
        }
      });
    });
  }

  public onChangeRecipeTab = (value: ForgeTabCategories) => {
    this.activeRecipeTab = value;
  };
}

export { ForgeStore };

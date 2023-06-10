import { ForgeTabCategoryName, ForgeTabCategories } from './Constants';

class ForgeRecipeTabCategory {
  public name: string;

  public category: ForgeTabCategories;

  constructor(category: ForgeTabCategories) {
    this.category = category;
    this.name = ForgeTabCategoryName[category];
  }
}

export { ForgeRecipeTabCategory };

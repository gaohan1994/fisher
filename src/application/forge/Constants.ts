import { ReactNode } from 'react';
import { Recipe } from '@FisherCore';

export interface ForgeCategory {
  key: ForgeTabCategories;
  name: string;
}

export enum ForgeTabCategories {
  EquipmentSet = 0,
  Rarity = 1,
  Slot = 2,
}

export interface CategoryNodeData {
  summary: ReactNode;
  recipes: Recipe[];
}

export const ForgeCategories: Record<ForgeTabCategories, ForgeCategory> = {
  [ForgeTabCategories.EquipmentSet]: {
    key: ForgeTabCategories.EquipmentSet,
    name: '按套装划分图纸',
  },
  [ForgeTabCategories.Rarity]: {
    key: ForgeTabCategories.Rarity,
    name: '按稀有度划分图纸',
  },
  [ForgeTabCategories.Slot]: {
    key: ForgeTabCategories.Slot,
    name: '按种类划分图纸',
  },
};

export class CategoryNode {
  public category: ForgeCategory;

  constructor(category: ForgeTabCategories, public data: CategoryNodeData[]) {
    this.category = ForgeCategories[category];
  }
}

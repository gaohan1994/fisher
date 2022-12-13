import invariant from 'invariant';
import {
  FisherCore,
  FisherItem,
  IFisherItem,
  FisherSkillRecipe,
} from '@FisherCore';
import miningDataJson from './data/MiningData.json';
import reikiDataJson from './data/ReikiData.json';

export interface IFisherPackagesData {
  items: FisherItem[];
  recipes: FisherSkillRecipe[];
  recipePartMap: RecipePartMap;
}

type RecipePartMap = Map<string, FisherSkillRecipe[]>;

type IFisherCollectionPackageItemsAndRecipes = Pick<
  IFisherPackagesData,
  'items' | 'recipes'
>;

export type IFisherMiningPackagesData = IFisherCollectionPackageItemsAndRecipes;

interface IFisherComponentWithPackagesData {
  packagesData: IFisherPackagesData;
}

interface PackageCollectionJsonDataSource {
  moduleName: string;
  data: {
    items: IFisherItemPackageJsonDatga[];
    recipes: IFisherRecipePackageJsonData[];
  };
}

interface IFisherItemPackageJsonDatga {
  id: string;
  name: string;
  desc: string;
  media: string;
  type: string;
  price: number;
}

interface IFisherRecipePackageJsonData {
  id: string;
  name: string;
  desc: string;
  media: string;
  interval: number;
  unlockLevel: number;
  rewardExperience: number;
  rewardItemId: string;
  rewardQuantity: number;
}

/**
 * 初始化游戏数据
 *
 * @export
 * @param {FisherCore} fisherCore
 */
export function launchFisherGamePackagesData(fisherCore: FisherCore) {
  // 初始化采矿数据
  const { items: miningItems, recipes: miningRecipes } =
    makePackageCollectionDataSource(miningDataJson);
  fisherCore.mining.packagesData.items.push(...miningItems);
  fisherCore.mining.packagesData.recipes.push(...miningRecipes);

  // 初始化灵气数据
  const { items: reikiItems, recipes: reikiRecipes } =
    makePackageCollectionDataSource(reikiDataJson);
  fisherCore.reiki.packagesData.items.push(...reikiItems);
  fisherCore.reiki.packagesData.recipes.push(...reikiRecipes);

  fisherCore.packagesData.items.push(...miningItems, ...reikiItems);
  fisherCore.packagesData.recipes.push(...miningRecipes, ...reikiRecipes);

  // 根据 recipe name 划分配方
  makeRecipePartMap(fisherCore.reiki);
  makeRecipePartMap(fisherCore);
}

/**
 * 根据 JSON 初始化游戏数据
 *
 * @param {PackageCollectionJsonDataSource} dataSource
 * @return {*}  {IFisherCollectionPackageItemsAndRecipes}
 */
function makePackageCollectionDataSource(
  dataSource: PackageCollectionJsonDataSource
): IFisherCollectionPackageItemsAndRecipes {
  const {
    data: { items: itemsJson, recipes: recipesJson },
  } = dataSource;
  const items = launchPackagesFisherItems(itemsJson as IFisherItem[]);

  const recipes = recipesJson.map((item) => {
    const rewardItem = items.find(
      (fisherItem) => fisherItem.id === item.rewardItemId
    );
    invariant(
      rewardItem !== undefined,
      'Fail to launch packages data, undefined reward item id' +
        item.rewardItemId
    );
    return new FisherSkillRecipe({
      id: item.id,
      name: item.name,
      desc: item.desc,
      media: item.media,
      interval: item.interval,
      unlockLevel: item.unlockLevel,
      rewardItem,
      rewardExperience: item.rewardExperience,
      rewardQuantity: item.rewardQuantity,
    });
  });
  return { items, recipes };
}

/**
 * 初始化普通物品
 *
 * @export
 * @param {IFisherItem[]} dataSource
 * @return {*}
 */
function launchPackagesFisherItems(itemsJson: IFisherItemPackageJsonDatga[]) {
  const fisherItems = itemsJson.map(
    (item) => new FisherItem({ ...(item as IFisherItem) })
  );
  return fisherItems;
}

/**
 * 整合重名的配方
 *
 * @param {FisherSkillRecipe[]} recipes
 * @return {*}  {RecipePartMap}
 */
function makeRecipePartMap<T extends IFisherComponentWithPackagesData>(
  fisherComponent: T
) {
  const result = new Map();
  fisherComponent.packagesData.recipes.forEach((item) => {
    if (result.has(item.name)) {
      const prevRecipeValue = result.get(item.name);
      invariant(prevRecipeValue !== undefined, 'Fail to add recipe to map');
      prevRecipeValue.push(item);
      result.set(item.name, prevRecipeValue);
    } else {
      result.set(item.name, [item]);
    }
  });
  fisherComponent.packagesData.recipePartMap = result;
}

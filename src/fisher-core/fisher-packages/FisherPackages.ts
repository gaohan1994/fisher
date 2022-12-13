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
  recipePartMap?: RecipePartMap;
}

type RecipePartMap = Map<string, FisherSkillRecipe[]>;

interface IFisherComponentWithPackagesData {
  packagesData: IFisherPackagesData;
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
  launchPackagesJsonData(fisherCore, miningDataJson);
  launchPackagesJsonData(fisherCore.mining, miningDataJson);

  // 初始化灵气数据
  launchPackagesJsonData(fisherCore, reikiDataJson);
  launchPackagesJsonData(fisherCore.reiki, reikiDataJson);
  makeRecipePartMap(fisherCore.reiki);
}

function launchPackagesJsonData<T extends IFisherComponentWithPackagesData>(
  fisherComponent: T,
  dataSource: any
) {
  const fisherItems = launchPackagesFisherItems(
    dataSource.data.items as IFisherItem[]
  );
  fisherComponent.packagesData.items.push(...fisherItems);
  const recipes = launchPackagesRecipes(
    dataSource.data.recipes,
    fisherComponent
  );
  fisherComponent.packagesData.recipes.push(...recipes);
}

/**
 * 初始化普通物品
 *
 * @export
 * @param {IFisherItem[]} dataSource
 * @return {*}
 */
export function launchPackagesFisherItems(dataSource: IFisherItem[]) {
  const fisherItems = dataSource.map((item) => new FisherItem({ ...item }));
  return fisherItems;
}

/**
 * 初始化技能配方
 *
 * @export
 * @param {IFisherRecipePackageJsonData[]} dataSource
 * @return {*}
 */
export function launchPackagesRecipes<
  T extends IFisherComponentWithPackagesData
>(dataSource: IFisherRecipePackageJsonData[], fisherComponent: T) {
  const recipes = dataSource.map((item) => {
    const rewardItem = fisherComponent.packagesData.items.find(
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
  return recipes;
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

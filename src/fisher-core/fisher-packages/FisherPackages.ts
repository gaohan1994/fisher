import invariant from 'invariant';
import {
  FisherCore,
  FisherItem,
  IFisherItem,
  FisherItemType,
  FisherSkillRecipe,
} from '@FisherCore';
import miningDataJson from './data/MiningData.json';

export interface IFisherPackagesData {
  items: FisherItem[];
  recipes: FisherSkillRecipe[];
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
  launchMiningPackagesData(fisherCore);
}

/**
 * 初始化采矿模块数据
 *
 * @export
 * @param {FisherCore} fisherCore
 */
export function launchMiningPackagesData(fisherCore: FisherCore) {
  const fisherItems = launchPackagesFisherItems(
    miningDataJson.data.items as IFisherItem[]
  );
  fisherCore.packagesData.items.push(...fisherItems);
  const recipes = launchPackagesRecipes(
    miningDataJson.data.recipes,
    fisherCore
  );
  fisherCore.packagesData.recipes.push(...recipes);
}

/**
 * 初始化普通物品
 *
 * @export
 * @param {IFisherItem[]} dataSource
 * @return {*}
 */
export function launchPackagesFisherItems(dataSource: IFisherItem[]) {
  const fisherItems = dataSource.map(
    (item) => new FisherItem({ ...item, type: FisherItemType.Mining })
  );
  return fisherItems;
}

/**
 * 初始化技能配方
 *
 * @export
 * @param {IFisherRecipePackageJsonData[]} dataSource
 * @return {*}
 */
export function launchPackagesRecipes(
  dataSource: IFisherRecipePackageJsonData[],
  fisherCore: FisherCore
) {
  const recipes = dataSource.map((item) => {
    const rewardItem = fisherCore.packagesData.items.find(
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

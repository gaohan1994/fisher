import invariant from 'invariant';
import {
  FisherItem,
  IFisherItem,
  FisherRecipeItem,
  FisherEquipmentItem,
  IFisherEquipmentItem,
  FisherNormalItem,
  IFisherRecipeItem,
} from '@FisherCore';
import miningDataJson from './data/MiningData.json';
import reikiDataJson from './data/ReikiData.json';
import equipmentDataJson from './data/EquipmentData.json';

export interface IFisherPackagesData {
  items: Array<FisherItem | FisherEquipmentItem>;
  recipes: FisherRecipeItem[];
}

export type IFisherMiningPackagesData = IFisherPackagesData;

export type IFisherReikiPackagesData = IFisherPackagesData & {
  recipePartMap: Map<string, FisherRecipeItem[]>;
};

interface PackageJsonDataSource<T> {
  moduleName: string;
  data: T;
}

type PackageCollectionJsonDataSource = PackageJsonDataSource<{
  items: IFisherItem[];
  recipes: IFisherRecipePackageJsonData[];
}>;

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

type PackageEquipmentJsonDataSource = PackageJsonDataSource<{
  emptyEquipment: IFisherEquipmentItem;
  items: IFisherEquipmentItem[];
}>;

export function makeMiningPackagesData(): IFisherMiningPackagesData {
  return makePackageCollectionDataSource(
    miningDataJson as PackageCollectionJsonDataSource
  );
}
export function makeReikiPackagesData(): IFisherReikiPackagesData {
  const { items, recipes } = makePackageCollectionDataSource(
    reikiDataJson as PackageCollectionJsonDataSource
  );
  return {
    items,
    recipes,
    recipePartMap: makeRecipePartMap(recipes),
  };
}

/**
 * 生成装备数据
 *
 * @param {PackageEquipmentJsonDataSource} dataSource
 * @return {*}
 */
export function makeEquipmentPackagesData() {
  const {
    data: { emptyEquipment: emptyEquipmentJson, items: itemsJson },
  } = equipmentDataJson as PackageEquipmentJsonDataSource;
  const [emptyEquipment, ...equipments] = generatePackagesEquipments([
    emptyEquipmentJson,
    ...itemsJson,
  ]);
  return { emptyEquipment, equipments };
}

/**
 * 根据 JSON 初始化游戏数据
 *
 * @param {PackageCollectionJsonDataSource} dataSource
 * @return {*}  {IFisherCollectionPackageItemsAndRecipes}
 */
function makePackageCollectionDataSource(
  dataSource: PackageCollectionJsonDataSource
) {
  const {
    data: { items: itemsJson, recipes: recipesJson },
  } = dataSource;
  const items = generatePackagesFisherItems(itemsJson);

  const fisherRecipeDataJson = recipesJson.map((item) => {
    const rewardItem = items.find(
      (fisherItem) => fisherItem.id === item.rewardItemId
    );
    invariant(
      rewardItem !== undefined,
      'Fail to launch packages data, undefined reward item id' +
        item.rewardItemId
    );
    return {
      id: item.id,
      name: item.name,
      desc: item.desc,
      media: item.media,
      interval: item.interval,
      unlockLevel: item.unlockLevel,
      rewardItem,
      rewardExperience: item.rewardExperience,
      rewardQuantity: item.rewardQuantity,
    };
  });

  const recipes = generatePackagesFisherRecipeItems(fisherRecipeDataJson);
  return { items, recipes };
}

/**
 * 生成普通物品
 *
 * @export
 * @param {IFisherItem[]} dataSource
 * @return {*}
 */
function generatePackagesFisherItems(itemsJson: IFisherItem[]) {
  return itemsJson.map((item) => new FisherNormalItem(item));
}

/**
 * 生成配方
 *
 * @param {IFisherRecipeItem[]} itemsJson
 * @return {*}
 */
function generatePackagesFisherRecipeItems(itemsJson: IFisherRecipeItem[]) {
  return itemsJson.map((item) => new FisherRecipeItem(item));
}

/**
 * 生成装备物品
 *
 * @param {IFisherEquipmentItem[]} itemsJson
 * @return {*}
 */
function generatePackagesEquipments(itemsJson: IFisherEquipmentItem[]) {
  return itemsJson.map((item) => new FisherEquipmentItem(item));
}

/**
 * 整合重名的配方
 *
 * @param {FisherSkillRecipe[]} recipes
 * @return {*}  {RecipePartMap}
 */
function makeRecipePartMap(recipes: FisherRecipeItem[]) {
  const result = new Map();
  recipes.forEach((item) => {
    if (result.has(item.name)) {
      const prevRecipeValue = result.get(item.name);
      invariant(prevRecipeValue !== undefined, 'Fail to add recipe to map');
      prevRecipeValue.push(item);
      result.set(item.name, prevRecipeValue);
    } else {
      result.set(item.name, [item]);
    }
  });
  return result;
}

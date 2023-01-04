import invariant from 'invariant';
import {
  Item,
  IItem,
  RecipeItem,
  EquipmentItem,
  IEquipmentItem,
  FisherNormalItem,
  IFisherRecipeItem,
} from '@FisherCore';
import miningDataJson from './data/MiningData.json';
import reikiDataJson from './data/ReikiData.json';
import equipmentDataJson from './data/EquipmentData.json';
import battleDataJson from './data/BattleData.json';
import {
  IBattleAreaItem,
  BattleAreaItem,
  BattleEnemyItem,
  IBattleEnemyItem,
} from '../fisher-item';

export interface IFisherPackagesData {
  items: Array<Item | EquipmentItem>;
  recipes: RecipeItem[];
}

export type IFisherMiningPackagesData = IFisherPackagesData;

export type IFisherReikiPackagesData = IFisherPackagesData & {
  recipePartMap: Map<string, RecipeItem[]>;
};

interface PackageJsonDataSource<T> {
  moduleName: string;
  data: T;
}

type PackageCollectionJsonDataSource = PackageJsonDataSource<{
  items: IItem[];
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
  emptyEquipment: IEquipmentItem;
  items: IEquipmentItem[];
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
 * 生成战斗模块数据
 *
 * @export
 * @return {*}
 */
export function makeBattlePackageData() {
  const { area: areaJson, enemy: enemyJson } = battleDataJson;
  const battleEnemies = generatePackagesBattleEnemies(
    enemyJson as IBattleEnemyItem[]
  );
  const battleAreas = areaJson.map((area) => {
    const areaEnemis: BattleEnemyItem[] = [];
    area.enemies.forEach((enemyId) => {
      const enemy = battleEnemies.find((enemy) => enemy.id === enemyId);
      if (!enemy) {
        throw new Error(`Cannt find enemy id: ${enemyId}`);
      }
      areaEnemis.push(enemy);
    });
    return new BattleAreaItem({
      ...area,
      enemies: areaEnemis,
    } as IBattleAreaItem);
  });

  return { battleAreas, battleEnemies };
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
    const rewardItem = items.find((Item) => Item.id === item.rewardItemId);
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
 */
function generatePackagesFisherItems(itemsJson: IItem[]) {
  return itemsJson.map((item) => new FisherNormalItem(item));
}

/**
 * 生成配方
 */
function generatePackagesFisherRecipeItems(itemsJson: IFisherRecipeItem[]) {
  return itemsJson.map((item) => new RecipeItem(item));
}

/**
 * 生成装备物品
 */
function generatePackagesEquipments(itemsJson: IEquipmentItem[]) {
  return itemsJson.map((item) => new EquipmentItem(item));
}

/**
 * 生成敌人数据
 */
function generatePackagesBattleEnemies(itemsJson: IBattleEnemyItem[]) {
  return itemsJson.map((item) => new BattleEnemyItem(item));
}

/**
 * 整合重名的配方
 *
 * @param {FisherSkillRecipe[]} recipes
 * @return {*}  {RecipePartMap}
 */
function makeRecipePartMap(recipes: RecipeItem[]) {
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

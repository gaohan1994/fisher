import miningDataJson from './data/MiningData.json';
import reikiDataJson from './data/ReikiData.json';
import equipmentDataJson from './data/EquipmentData.json';
import battleDataJson from './data/BattleData.json';
import {
  Item,
  IItem,
  RecipeItem,
  EquipmentItem,
  IEquipmentItem,
  NormalItem,
  IRecipeItem,
  IBattleAreaItem,
  BattleAreaItem,
  EnemyItem,
  IEnemyItem,
} from '../fisher-item';

export interface ICollectionModuleData {
  items: Array<Item | EquipmentItem>;
  recipes: RecipeItem[];
}

interface PackageJsonDataSource<T> {
  moduleName: string;
  data: T;
}

type PackageCollectionJsonDataSource = PackageJsonDataSource<{
  items: IItem[];
  recipes: IRecipeItem[];
}>;

type PackageEquipmentJsonDataSource = PackageJsonDataSource<{
  emptyEquipment: IEquipmentItem;
  items: IEquipmentItem[];
}>;

export function makeMiningPackagesData(): ICollectionModuleData {
  return makePackageCollectionDataSource(miningDataJson);
}
export function makeReikiPackagesData(): ICollectionModuleData {
  return makePackageCollectionDataSource(reikiDataJson);
}

/**
 * 生成装备数据
 *
 * @param {PackageEquipmentJsonDataSource} dataSource
 * @return {*}
 */
export function makeEquipmentPackagesData() {
  const {
    data: { items: itemsJson },
  } = equipmentDataJson as PackageEquipmentJsonDataSource;
  return generatePackagesEquipments(itemsJson);
}

/**
 * 生成战斗模块数据
 *
 * @export
 * @return {*}
 */
export function makeBattlePackageData() {
  const { area: areaJson, enemy: enemyJson } = battleDataJson;
  const battleEnemies = generateEnemies(enemyJson as IEnemyItem[]);
  const battleAreas = areaJson.map((area) => {
    const areaEnemis: EnemyItem[] = [];
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

function makePackageCollectionDataSource(dataSource: PackageCollectionJsonDataSource) {
  const items = generatePackagesItems(dataSource.data.items);
  const recipes = generatePackagesRecipeItems(dataSource.data.recipes);
  return { items, recipes };
}

/**
 * 生成普通物品
 */
function generatePackagesItems(itemsJson: IItem[]) {
  return itemsJson.map((item) => new NormalItem(item));
}

/**
 * 生成配方
 */
function generatePackagesRecipeItems(itemsJson: IRecipeItem[]) {
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
function generateEnemies(itemsJson: IEnemyItem[]) {
  return itemsJson.map((item) => new EnemyItem(item));
}

import RewardChestDataJson from './data/RewardChestData.json';
import miningDataJson from './data/MiningData.json';
import reikiDataJson from './data/ReikiData.json';
import equipmentDataJson from './data/EquipmentData.json';
import equipmentSetDataJson from './data/EquipmentSetData.json';
import battleDataJson from './data/BattleData.json';
import forgeDataJson from './data/ForgeData.json';
import cookDataJson from './data/CookData.json';
import ShopDataJson from './data/ShopData.json';
import PotionDataJson from './data/PotionData.json';
import {
  Item,
  IItem,
  Recipe,
  IRecipe,
  EquipmentItem,
  IEquipmentItem,
  NormalItem,
  IBattleAreaItem,
  BattleAreaItem,
  EnemyItem,
  IEnemyItem,
  IEquipmentSet,
  EquipmentSet,
  IShopCategory,
  ShopCategory,
  IRewardChest,
  RewardChest,
  IHealPotion,
  HealPotion,
} from '../fisher-item';

export interface ICollectionModuleData {
  items: Array<Item | NormalItem>;
  recipes: Recipe[];
}

interface PackageJsonDataSource<T> {
  moduleName: string;
  data: T;
}

type PackageCollectionJsonDataSource = PackageJsonDataSource<{
  items: IItem[];
  recipes: IRecipe[];
}>;

export function makeRewardChestsData() {
  return generateRewardChests(RewardChestDataJson.data.items);
}

export function makeMiningPackagesData(): ICollectionModuleData {
  return makePackageCollectionDataSource(miningDataJson);
}
export function makeReikiPackagesData(): ICollectionModuleData {
  return makePackageCollectionDataSource(reikiDataJson);
}

export function makeEquipmentPackagesData() {
  return generateEquipments(equipmentDataJson.data.items);
}

export function makeEquipmentSetData() {
  return generateEquipmentSets(equipmentSetDataJson.data.items);
}

export function makeForgePackagesData(): [Recipe[], NormalItem[]] {
  return [generatePackagesRecipes(forgeDataJson.data.recipes), generatePackagesItems(forgeDataJson.data.bluePrints)];
}

export function makeCookPackagesData(): [Recipe[], NormalItem[], NormalItem[]] {
  return [
    generatePackagesRecipes(cookDataJson.data.recipes),
    generatePackagesItems(cookDataJson.data.bluePrints),
    generatePackagesItems(cookDataJson.data.shopItems),
  ];
}

export function makeShopData() {
  return generateShopCategories(ShopDataJson.data);
}

export function makeHealPotionData() {
  return generateHealPotions(PotionDataJson.data.healPotions);
}

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
  const recipes = generatePackagesRecipes(dataSource.data.recipes);
  return { items, recipes };
}

function generatePackagesItems(itemsJson: IItem[]) {
  return itemsJson.map((item) => new NormalItem(item));
}

function generatePackagesRecipes(itemsJson: IRecipe[]) {
  return itemsJson.map((item) => new Recipe(item));
}

function generateEquipments(itemsJson: IEquipmentItem[]) {
  return itemsJson.map((item) => new EquipmentItem(item));
}

function generateEquipmentSets(itemsJson: IEquipmentSet[]) {
  return itemsJson.map((item) => new EquipmentSet(item));
}

function generateEnemies(itemsJson: IEnemyItem[]) {
  return itemsJson.map((item) => new EnemyItem(item));
}

function generateShopCategories(itemsJson: IShopCategory[]) {
  return itemsJson.map((item) => new ShopCategory(item));
}

function generateRewardChests(itemsJson: IRewardChest[]) {
  return itemsJson.map((item) => new RewardChest(item));
}

function generateHealPotions(itemsJson: IHealPotion[]) {
  return itemsJson.map((item) => new HealPotion(item));
}

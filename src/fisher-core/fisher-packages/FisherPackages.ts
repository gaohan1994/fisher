import normalDataJson from './data/NormalData.json';
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
import DungeonDataJson from './data/DungeonData.json';
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
  IDungeonItem,
  DungeonItem,
  EquipmentSlot,
  Rarity,
} from '../fisher-item';

export interface ICollectionModuleData {
  items: Array<Item | NormalItem>;
  recipes: Recipe[];
}

export function makeNormalData() {
  return generatePackagesItems(normalDataJson.data as any[]);
}

export function makeRewardChestsData() {
  return generateRewardChests(RewardChestDataJson.data.items);
}

export function makeMiningPackagesData(): ICollectionModuleData {
  const items = generatePackagesItems(miningDataJson.data.items as any[]);
  const recipes = generatePackagesRecipes(miningDataJson.data.recipes);
  return { items, recipes };
}
export function makeReikiPackagesData(): ICollectionModuleData {
  const items = generatePackagesItems(reikiDataJson.data.items as any[]);
  const recipes = generatePackagesRecipes(reikiDataJson.data.recipes);
  return { items, recipes };
}

export function makeEquipmentPackagesData() {
  let result: EquipmentItem[] = [];
  Object.keys(EquipmentSlot).forEach((slot) => {
    result.push(...generateEquipments(equipmentDataJson[slot as EquipmentSlot] as IEquipmentItem[]));
  });
  return result;
}

export function makeEquipmentSetData() {
  return generateEquipmentSets(equipmentSetDataJson.data.items);
}

export function makeForgePackagesData(): [Recipe[], NormalItem[], Map<EquipmentSlot, Recipe[]>, Map<Rarity, Recipe[]>] {
  const splitRecipesByRarity = (recipes: Recipe[]) => {
    const result = new Map<Rarity, Recipe[]>();

    recipes.forEach((recipe) => {
      const { rarity } = recipe;
      const rarityRecipes = result.get(rarity) ?? [];
      rarityRecipes.push(recipe);
      result.set(rarity, rarityRecipes);
    });

    return Array.from(result);
  };

  const allRecipes: Recipe[] = [];
  const slotCategoryRecipeMap = new Map<EquipmentSlot, Recipe[]>();
  const rarityCategoryRecipeMap = new Map<Rarity, Recipe[]>();

  rarityCategoryRecipeMap.set(Rarity.Common, []);
  rarityCategoryRecipeMap.set(Rarity.Rare, []);
  rarityCategoryRecipeMap.set(Rarity.Epic, []);
  rarityCategoryRecipeMap.set(Rarity.Legendary, []);

  Object.keys(EquipmentSlot).forEach((slot) => {
    const recipes = [...generatePackagesRecipes(forgeDataJson[slot as EquipmentSlot] as IRecipe[])];
    allRecipes.push(...recipes);
    slotCategoryRecipeMap.set(slot as EquipmentSlot, recipes);

    splitRecipesByRarity(recipes).forEach(([rarity, currentSlotRarityRecipes]) => {
      const rarityRecipes = rarityCategoryRecipeMap.get(rarity)!;
      rarityRecipes.push(...currentSlotRarityRecipes);
      rarityCategoryRecipeMap.set(rarity, rarityRecipes);
    });
  });

  return [allRecipes, generatePackagesItems(forgeDataJson.bluePrints), slotCategoryRecipeMap, rarityCategoryRecipeMap];
}

export function makeCookPackagesData(): [Recipe[], NormalItem[]] {
  return [generatePackagesRecipes(cookDataJson.data.recipes), generatePackagesItems(cookDataJson.data.bluePrints)];
}

export function makeShopData() {
  return generateShopCategories(ShopDataJson.data);
}

export function makeHealPotionData() {
  return generateHealPotions(PotionDataJson.data.healPotions);
}

export function makeDungeonData() {
  return generateDungeonData(DungeonDataJson.data as IDungeonItem[]);
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
      enemies: areaEnemis.sort((a, b) => a.level - b.level),
    } as IBattleAreaItem);
  });

  return { battleAreas, battleEnemies };
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

function generateDungeonData(itemsJson: IDungeonItem[]) {
  return itemsJson.map((item) => new DungeonItem(item));
}

import NormalDataJson from '@assets/data/NormalData.json';
import RewardChestDataJson from '@assets/data/RewardChestData.json';
import MiningDataJson from '@assets/data/MiningData.json';
import ReikiDataJson from '@assets/data/ReikiData.json';
import EquipmentDataJson from '@assets/data/EquipmentData.json';
import EquipmentSetDataJson from '@assets/data/EquipmentSetData.json';
import BattleDataJson from '@assets/data/BattleData.json';
import ForgeDataJson from '@assets/data/ForgeData.json';
import CookDataJson from '@assets/data/CookData.json';
import ShopDataJson from '@assets/data/ShopData.json';
import PotionDataJson from '@assets/data/PotionData.json';
import DungeonDataJson from '@assets/data/DungeonData.json';
import { EquipmentSlot } from '@shared';
import {
  Recipe,
  IRecipe,
  Rarity,
  EquipmentItem,
  NormalItem,
  BattleAreaItem,
  EnemyItem,
  EquipmentSet,
  ShopCategory,
  RewardChest,
  HealPotion,
  DungeonItem,
} from '@item';

interface ServiceDataCtor<T = any[], R = any> {
  new (...rest: T[]): R;
}
function serviceDataGeneratorFactory<T = any, R = any>(Constructor: ServiceDataCtor<T, R>) {
  return function dataFacotry(datasource: T[]) {
    return datasource.map((item: T) => {
      return new Constructor(item);
    });
  };
}

const normalFactory = serviceDataGeneratorFactory(NormalItem);

const recipeFactory = serviceDataGeneratorFactory(Recipe);

const rewardChestFacotry = serviceDataGeneratorFactory(RewardChest);

const dungeonFacotry = serviceDataGeneratorFactory(DungeonItem);

const enemyFacotry = serviceDataGeneratorFactory(EnemyItem);

const shopCategoryFacotry = serviceDataGeneratorFactory(ShopCategory);

const equipmentItemFacotry = serviceDataGeneratorFactory(EquipmentItem);

const equipmentSetFacotry = serviceDataGeneratorFactory(EquipmentSet);

const healPotionFacotry = serviceDataGeneratorFactory(HealPotion);

export function makeNormalData() {
  return normalFactory(NormalDataJson.data);
}

export function makeShopCategoryData() {
  return shopCategoryFacotry(ShopDataJson.data);
}

export function makeRewardChestsData() {
  return rewardChestFacotry(RewardChestDataJson.data as any[]);
}

export function makeHealPotionData() {
  return healPotionFacotry(PotionDataJson.heal);
}

export function makeMiningData() {
  return [normalFactory(MiningDataJson.items), recipeFactory(MiningDataJson.recipes)] as const;
}

export function makeReikiData() {
  return [normalFactory(ReikiDataJson.items), recipeFactory(ReikiDataJson.recipes)] as const;
}

export function makeCookData() {
  return [normalFactory(CookDataJson.bluePrints), recipeFactory(CookDataJson.recipes)] as const;
}

export function makeEquipmentSetData() {
  return equipmentSetFacotry(EquipmentSetDataJson.data);
}

export function makeDungeonData() {
  return dungeonFacotry(DungeonDataJson.data as any[]);
}

export function makeBattleData() {
  const enemies = enemyFacotry(BattleDataJson.enemy);
  const areas = BattleDataJson.area.map((item) => {
    const enemies: EnemyItem[] = item.enemies
      .map((enemyId) => enemies.find((enemy) => enemy.id === enemyId)!)
      .sort((a, b) => a.level - b.level);

    return new BattleAreaItem({
      ...item,
      enemies,
    });
  });

  return [areas, enemies] as const;
}

/**
 * Wrappe function
 * Generate data from equipment slot
 * @param datasource
 * @param factory
 * @returns
 */
function makeDataByEquipmentSlot<T, R>(
  datasource: Record<EquipmentSlot, R[]>,
  factory: (args: R[], slot: EquipmentSlot) => T[]
) {
  return Object.keys(EquipmentSlot).reduce<T[]>((acc, slot) => {
    return acc.concat(...factory(datasource[slot as EquipmentSlot], slot as EquipmentSlot));
  }, [] as T[]);
}

export function makeEquipmentData() {
  return makeDataByEquipmentSlot(EquipmentDataJson, equipmentItemFacotry);
}

export function makeForgeData() {
  const equipments = makeEquipmentData();
  const equipmentSets = makeEquipmentSetData();
  const recipesByRarity = new Map<Rarity, Recipe[]>();
  const recipesByEquipmentSlot = new Map<EquipmentSlot, Recipe[]>();
  const recipesByEquipmentSet = new Map<EquipmentSet, Recipe[]>();

  /**
   * Handle recipes by rarity
   * @param recipe
   */
  function insertRecipesByRarity(recipe: Recipe) {
    const { rarity } = recipe;
    if (recipesByRarity.has(rarity)) {
      recipesByRarity.set(rarity, recipesByRarity.get(rarity)!.concat(recipe));
    } else {
      recipesByRarity.set(rarity, [recipe]);
    }
  }

  /**
   * Handle recipes by slot
   * @param recipe
   */
  function insertRecipesByEquipmentSlot(recipe: Recipe, slot: EquipmentSlot) {
    if (recipesByEquipmentSlot.has(slot)) {
      recipesByEquipmentSlot.set(slot, recipesByEquipmentSlot.get(slot)!.concat(recipe));
    } else {
      recipesByEquipmentSlot.set(slot, [recipe]);
    }
  }

  /**
   *
   * Handle recipes by equipment set
   * - Find reward item if is equipment
   * - Check equipment if has equipment set
   * @param recipe
   */
  function tryInsertRecipesByEquipmentSet(recipe: Recipe) {
    const { rewardItems } = recipe;
    const rewardEquipments = rewardItems
      .map((item) => equipments.find((equipment) => equipment.id === item.itemId))
      .filter(Boolean) as EquipmentItem[];

    rewardEquipments.forEach((equipment) => {
      if (equipment.hasEquipmentSet) {
        const equipmentSet = equipmentSets.find((set) => set.id === equipment.equipmentSetId!)!;

        if (recipesByEquipmentSet.has(equipmentSet)) {
          recipesByEquipmentSet.set(equipmentSet, recipesByEquipmentSet.get(equipmentSet)!.concat(recipe));
        } else {
          recipesByEquipmentSet.set(equipmentSet, [recipe]);
        }
      }
    });
  }

  function forgeRecipeFactory(datasource: IRecipe[], slot: EquipmentSlot) {
    return datasource.map((item) => {
      const recipe = new Recipe(item);
      insertRecipesByRarity(recipe);
      insertRecipesByEquipmentSlot(recipe, slot);
      tryInsertRecipesByEquipmentSet(recipe);
      return recipe;
    });
  }

  const recipes = makeDataByEquipmentSlot(ForgeDataJson, forgeRecipeFactory);

  return {
    recipes,
    recipesByRarity,
    recipesByEquipmentSlot,
    recipesByEquipmentSet,
    bluePrints: normalFactory(ForgeDataJson.bluePrints),
  };
}

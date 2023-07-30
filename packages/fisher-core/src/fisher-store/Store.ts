import { makeAutoObservable } from 'mobx';
import { prefixes, prefixLogger } from '@fisher/logger';
import {
  Item,
  Recipe,
  BattleAreaItem,
  EquipmentItem,
  EnemyItem,
  EquipmentSet,
  NormalItem,
  ShopCategory,
  RewardChest,
  HealPotion,
  DungeonItem,
  EquipmentSlot,
  Rarity,
} from '@item';
import { ComponentId, FisherCoreError } from '@shared';
import { service } from '@fisher/ioc';
import {
  makeBattleData,
  makeCookData,
  makeDungeonData,
  makeEquipmentData,
  makeEquipmentSetData,
  makeForgeData,
  makeHealPotionData,
  makeMiningData,
  makeNormalData,
  makeReikiData,
  makeRewardChestsData,
  makeShopCategoryData,
} from './serviceDataGenerators.js';

@service(ComponentId.Store)
class Store {
  public static logger = prefixLogger(prefixes.FISHER_CORE, 'Store');

  public readonly id = ComponentId.Store;

  public normalItems: NormalItem[] = [];

  public rewardChests: RewardChest[] = [];

  public miningRecipes: Recipe[] = [];

  public miningItems: NormalItem[] = [];

  public reikiRecipes: Recipe[] = [];

  public reikiItems: NormalItem[] = [];

  public forgeRecipes: Recipe[] = [];

  public forgeBluePrints: NormalItem[] = [];

  public forgeRecipesByRarity = new Map<Rarity, Recipe[]>();

  public forgeRecipesByEquipmentSlot = new Map<EquipmentSlot, Recipe[]>();

  public forgeRecipesByEquipmentSet = new Map<EquipmentSet, Recipe[]>();

  public cookRecipes: Recipe[] = [];

  public cookBluePrints: NormalItem[] = [];

  public equipments: EquipmentItem[] = [];

  public equipmentSets: EquipmentSet[] = [];

  public battleAreas: BattleAreaItem[] = [];

  public dungeonItems: DungeonItem[] = [];

  public shopCategories: ShopCategory[] = [];

  public healPotions: HealPotion[] = [];

  public get items() {
    return [
      ...this.normalItems,
      ...this.rewardChests,
      ...this.miningItems,
      ...this.miningRecipes,
      ...this.reikiItems,
      ...this.reikiRecipes,
      ...this.forgeRecipes,
      ...this.forgeBluePrints,
      ...this.cookRecipes,
      ...this.cookBluePrints,
      ...this.equipments,
      ...this.equipmentSets,
      ...this.battleAreas,
      ...this.dungeonItems,
      ...this.shopCategories,
      ...this.healPotions,
    ];
  }

  constructor() {
    makeAutoObservable(this);

    this.initializeNormalItems();
    this.initializeRewardChests();
    this.initializeMining();
    this.initializeReiki();
    this.initializeForge();
    this.initializeCook();
    this.initializeEquipments();
    this.initializeEquipmentSets();
    this.initializeBattle();
    this.initializeDungeon();
    this.initializeShop();
    this.initializePotions();
  }

  private initializeNormalItems = () => {
    this.normalItems = makeNormalData();
    Store.logger.info('initialize NormalItems data');
  };

  private initializeRewardChests = () => {
    this.rewardChests = makeRewardChestsData();
    Store.logger.info('initialize RewardChest data');
  };

  private initializeMining = () => {
    [this.miningItems, this.miningRecipes] = makeMiningData();
    Store.logger.info('initialize Mining data');
  };

  private initializeReiki = () => {
    [this.reikiItems, this.reikiRecipes] = makeReikiData();
    Store.logger.info('initialize Reiki data');
  };

  private initializeForge = () => {
    const { recipes, recipesByEquipmentSet, recipesByEquipmentSlot, recipesByRarity, bluePrints } = makeForgeData();
    this.forgeRecipes = recipes;
    this.forgeBluePrints = bluePrints;
    this.forgeRecipesByRarity = recipesByRarity;
    this.forgeRecipesByEquipmentSlot = recipesByEquipmentSlot;
    this.forgeRecipesByEquipmentSet = recipesByEquipmentSet;
    Store.logger.info('initialize Forge data');
  };

  private initializeCook = () => {
    [this.cookBluePrints, this.cookRecipes] = makeCookData();
    Store.logger.info('initialize Cook data');
  };

  private initializeEquipments = () => {
    this.equipments = makeEquipmentData();
    Store.logger.info('initialize Equipments data');
  };

  private initializeEquipmentSets = () => {
    this.equipmentSets = makeEquipmentSetData();
    Store.logger.info('initialize Equipment sets data');
  };

  private initializeBattle = () => {
    this.battleAreas = makeBattleData();
    Store.logger.info('initialize BattleArea and BattleEnemies data');
  };

  private initializeDungeon = () => {
    this.dungeonItems = makeDungeonData();
    Store.logger.info('initialize Dungeons data');
  };

  private initializeShop = () => {
    this.shopCategories = makeShopCategoryData();
    Store.logger.info('initialize shop categories data');
  };

  private initializePotions = () => {
    this.healPotions = makeHealPotionData();
    Store.logger.info('initialize potion data');
  };

  public findItemById = <T = Item>(itemId: string) => {
    const result = this.items.find((item) => item.id === itemId);

    if (result === undefined) {
      throw new FisherCoreError(`Could not find Item id: ${itemId}`, '没有找到物品');
    }

    return result as T;
  };

  public findRecipeById = (id: string) => {
    return this.findItemById<Recipe>(id);
  };

  public findEquipmentById = (id: string) => {
    return this.findItemById<EquipmentItem>(id);
  };

  public findEquipmentSetById = (id: string) => {
    return this.findItemById<EquipmentSet>(id);
  };

  public findEnemyById = (id: string) => {
    return this.findItemById<EnemyItem>(id);
  };
}

export { Store };

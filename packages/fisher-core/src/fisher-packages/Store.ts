import { makeAutoObservable } from 'mobx';
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
import { prefixes, prefixLogger } from '@fisher/logger';
import {
  ICollectionModuleData,
  makeBattlePackageData,
  makeCookPackagesData,
  makeDungeonData,
  makeEquipmentPackagesData,
  makeEquipmentSetData,
  makeForgePackagesData,
  makeHealPotionData,
  makeMiningPackagesData,
  makeNormalData,
  makeReikiPackagesData,
  makeRewardChestsData,
  makeShopData,
} from './FisherPackages';
import { FisherCoreError } from '@shared';

class Store {
  public static logger = prefixLogger(prefixes.FISHER_CORE, 'Store');

  public static instance: Store;

  public static create(): Store {
    if (!Store.instance) {
      Store.instance = new Store();
    }
    return Store.instance;
  }

  public NormalItems: NormalItem[] = [];

  public RewardChests: RewardChest[] = [];

  public Mining: ICollectionModuleData = { items: [], recipes: [] };

  public Reiki: ICollectionModuleData = { items: [], recipes: [] };

  public Forge: Recipe[] = [];

  public ForgeBluePrints: NormalItem[] = [];

  public ForgeSlotCategoryRecipeMap = new Map<EquipmentSlot, Recipe[]>();

  public ForgeRarityRecipeMap = new Map<Rarity, Recipe[]>();

  public Cook: Recipe[] = [];

  public CookBluePrints: NormalItem[] = [];

  public Equipments: EquipmentItem[] = [];

  public EquipmentSets: EquipmentSet[] = [];

  public BattleAreas: BattleAreaItem[] = [];

  public BattleEnemies: EnemyItem[] = [];

  public Dungeons: DungeonItem[] = [];

  public Shop: ShopCategory[] = [];

  public HealPotions: HealPotion[] = [];

  public get items() {
    return [
      ...this.NormalItems,
      ...this.RewardChests,
      ...this.Mining.items,
      ...this.Mining.recipes,
      ...this.Reiki.items,
      ...this.Reiki.recipes,
      ...this.Forge,
      ...this.ForgeBluePrints,
      ...this.Cook,
      ...this.CookBluePrints,
      ...this.Equipments,
      ...this.EquipmentSets,
      ...this.BattleAreas,
      ...this.BattleEnemies,
      ...this.Dungeons,
      ...this.Shop,
      ...this.HealPotions,
    ];
  }

  private constructor() {
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
    this.NormalItems = makeNormalData();
    Store.logger.info('initialize NormalItems data');
  };

  private initializeRewardChests = () => {
    this.RewardChests = makeRewardChestsData();
    Store.logger.info('initialize RewardChest data');
  };

  private initializeMining = () => {
    this.Mining = makeMiningPackagesData();
    Store.logger.info('initialize Mining data');
  };

  private initializeReiki = () => {
    this.Reiki = makeReikiPackagesData();
    Store.logger.info('initialize Reiki data');
  };

  private initializeForge = () => {
    const [forgeData, forgeBluePrintsData, slotCategoryRecipeMap, rarityCategoryRecipeMap] = makeForgePackagesData();
    this.Forge = forgeData;
    this.ForgeBluePrints = forgeBluePrintsData;
    this.ForgeSlotCategoryRecipeMap = slotCategoryRecipeMap;
    this.ForgeRarityRecipeMap = rarityCategoryRecipeMap;
    Store.logger.info('initialize Forge data');
  };

  private initializeCook = () => {
    const [cookData, cookBluePrintsData] = makeCookPackagesData();
    this.Cook = cookData;
    this.CookBluePrints = cookBluePrintsData;
    Store.logger.info('initialize Cook data');
  };

  private initializeEquipments = () => {
    const equipments = makeEquipmentPackagesData();
    this.Equipments = equipments;
    Store.logger.info('initialize Equipments data');
  };

  private initializeEquipmentSets = () => {
    this.EquipmentSets = makeEquipmentSetData();
    Store.logger.info('initialize Equipment sets data');
  };

  private initializeBattle = () => {
    const { battleAreas, battleEnemies } = makeBattlePackageData();
    this.BattleAreas = battleAreas;
    this.BattleEnemies = battleEnemies;
    Store.logger.info('initialize BattleArea and BattleEnemies data');
  };

  private initializeDungeon = () => {
    const dungeons = makeDungeonData();
    this.Dungeons = dungeons;
    Store.logger.info('initialize Dungeons data');
  };

  private initializeShop = () => {
    this.Shop = makeShopData();
    Store.logger.info('initialize shop data');
  };

  private initializePotions = () => {
    this.HealPotions = makeHealPotionData();
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

const store = Store.create();
(window as any).store = store;
export { store, Store };

import invariant from 'invariant';
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
} from '../fisher-item';
import { prefixes, prefixLogger } from '@FisherLogger';
import {
  ICollectionModuleData,
  makeBattlePackageData,
  makeEquipmentPackagesData,
  makeEquipmentSetData,
  makeForgePackagesData,
  makeHealPotionData,
  makeMiningPackagesData,
  makeReikiPackagesData,
  makeRewardChestsData,
  makeShopData,
} from './FisherPackages';

export class Store {
  public static logger = prefixLogger(prefixes.FISHER_CORE, 'Store');

  public static instance: Store;

  public static create(): Store {
    if (!Store.instance) {
      Store.instance = new Store();
      Store.instance.initializePackages();
    }
    return Store.instance;
  }

  public RewardChests: RewardChest[] = [];

  public Mining: ICollectionModuleData = { items: [], recipes: [] };

  public Reiki: ICollectionModuleData = { items: [], recipes: [] };

  public Forge: Recipe[] = [];

  public ForgeBluePrints: NormalItem[] = [];

  public Equipments: EquipmentItem[] = [];

  public EquipmentSets: EquipmentSet[] = [];

  public BattleAreas: BattleAreaItem[] = [];

  public BattleEnemies: EnemyItem[] = [];

  public Shop: ShopCategory[] = [];

  public HealPotions: HealPotion[] = [];

  public get items() {
    return [
      ...this.RewardChests,
      ...this.Mining.items,
      ...this.Mining.recipes,
      ...this.Reiki.items,
      ...this.Reiki.recipes,
      ...this.Forge,
      ...this.ForgeBluePrints,
      ...this.Equipments,
      ...this.EquipmentSets,
      ...this.BattleAreas,
      ...this.BattleEnemies,
      ...this.Shop,
      ...this.HealPotions,
    ];
  }

  public initializePackages = async () => {
    this.initializeRewardChests();
    this.initializeMining();
    this.initializeReiki();
    this.initializeForge();
    this.initializeEquipments();
    this.initializeEquipmentSets();
    this.initializeBattle();
    this.initializeShop();
    this.initializePotions();
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
    const [forgeData, forgeBluePrintsData] = makeForgePackagesData();
    this.Forge = forgeData;
    this.ForgeBluePrints = forgeBluePrintsData;
    Store.logger.info('initialize Forge data');
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
    invariant(result !== undefined, 'Could not find Item id: ' + itemId);
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
export { store };

import invariant from 'invariant';
import {
  BattleAreaItem,
  EquipmentItem,
  Recipe,
  PersonLevel,
  PersonLevelItem,
  EnemyItem,
  EquipmentSet,
} from '../fisher-item';
import { prefixes, prefixLogger } from '@FisherLogger';
import {
  ICollectionModuleData,
  makeBattlePackageData,
  makeEquipmentPackagesData,
  makeEquipmentSetData,
  makeMiningPackagesData,
  makeReikiPackagesData,
} from './FisherPackages';
import { generatePersonLevelData } from './PersonLevel';
import { EmptyEquipment } from './EmptyEquipment';
/**
 * 游戏模块数据库
 *
 * @class Store
 */
export class Store {
  public static logger = prefixLogger(prefixes.FISHER_CORE, 'Store');

  public static instance: Store;

  public static create = () => {
    if (!Store.instance) {
      Store.instance = new Store();
      Store.instance.initializePackages();
    }
    return Store.instance;
  };

  public Mining: ICollectionModuleData = { items: [], recipes: [] };

  public Reiki: ICollectionModuleData = { items: [], recipes: [] };

  public EmptyEquipment: EquipmentItem = EmptyEquipment;

  public Equipments: EquipmentItem[] = [];

  public EquipmentSets: EquipmentSet[] = [];

  public BattleAreas: BattleAreaItem[] = [];

  public BattleEnemies: EnemyItem[] = [];

  public personLevelMap: Map<PersonLevel, PersonLevelItem> = new Map();

  public get items() {
    return [
      this.EmptyEquipment,
      ...this.Mining.items,
      ...this.Mining.recipes,
      ...this.Reiki.items,
      ...this.Reiki.recipes,
      ...this.Equipments,
      ...this.EquipmentSets,
      ...this.BattleAreas,
      ...this.BattleEnemies,
    ];
  }

  public initializePackages = async () => {
    this.initializeMining();
    this.initializeReiki();
    this.initializeEquipments();
    this.initializeEquipmentSets();
    this.initializeBattle();
    this.initializePersonLevel();
  };

  private initializeMining = () => {
    this.Mining = makeMiningPackagesData();
    Store.logger.info('initialize Mining data');
  };

  private initializeReiki = () => {
    this.Reiki = makeReikiPackagesData();
    Store.logger.info('initialize Reiki data');
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

  private initializePersonLevel = () => {
    const personLevelMap = generatePersonLevelData();
    this.personLevelMap = personLevelMap;
  };
}

export const store = Store.create();

export function useModulePackage<T>(moduleKey: keyof typeof store) {
  return store[moduleKey] as T;
}

export function findItemById<T>(itemId: string) {
  const Item = store.items.find((item) => item.id === itemId);
  invariant(Item !== undefined, 'Could not find Item id: ' + itemId);
  return Item as T;
}

export function findRecipeById(id: string) {
  return findItemById<Recipe>(id);
}

export function findEquipmentById(id: string) {
  return findItemById<EquipmentItem>(id);
}

export function findEquipmentSetById(id: string) {
  return findItemById<EquipmentSet>(id);
}

export function findEnemyById(id: string) {
  return findItemById<EnemyItem>(id);
}

export function findPersonLevelItem(level: PersonLevel) {
  const result = store.personLevelMap.get(level);
  invariant(result !== undefined, `Try to find ${level} but got undefined`);
  return result;
}

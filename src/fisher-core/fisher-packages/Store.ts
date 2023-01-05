import invariant from 'invariant';
import {
  BattleAreaItem,
  BattleEnemyItem,
  EquipmentItem,
  Item,
  RecipeItem,
  PersonLevel,
  PersonLevelItem,
} from '../fisher-item';
import { prefixes, prefixLogger } from '@FisherLogger';
import {
  IFisherMiningPackagesData,
  IFisherReikiPackagesData,
  makeBattlePackageData,
  makeEquipmentPackagesData,
  makeMiningPackagesData,
  makeReikiPackagesData,
} from './FisherPackages';
import { generatePersonLevelData } from './PersonLevel';
/**
 * 游戏模块数据库
 *
 * @class Store
 */
export class Store {
  public static logger = prefixLogger(prefixes.FISHER_CORE, 'Store');

  public static instance: Store;

  public readonly Mining: IFisherMiningPackagesData;

  public readonly Reiki: IFisherReikiPackagesData;

  public readonly EmptyEquipment: EquipmentItem;

  public readonly Equipments: EquipmentItem[];

  public readonly BattleAreas: BattleAreaItem[] = [];

  public readonly BattleEnemies: BattleEnemyItem[] = [];

  public personLevelMap: Map<PersonLevel, PersonLevelItem>;

  public get items() {
    return [
      this.EmptyEquipment,
      ...this.Mining.items,
      ...this.Mining.recipes,
      ...this.Reiki.items,
      ...this.Reiki.recipes,
      ...this.Equipments,
      ...this.BattleAreas,
      ...this.BattleEnemies,
    ];
  }

  /**
   * Creates an instance of Store.
   * 初始化各个模块的数据
   * @memberof Store
   */
  constructor() {
    this.Mining = makeMiningPackagesData();
    Store.logger.info('initialize Mining data');

    this.Reiki = makeReikiPackagesData();
    Store.logger.info('initialize Reiki data');

    const { emptyEquipment, equipments } = makeEquipmentPackagesData();
    this.EmptyEquipment = emptyEquipment;
    this.Equipments = equipments;
    Store.logger.info('initialize Equipments data');

    const { battleAreas, battleEnemies } = makeBattlePackageData();
    this.BattleAreas = battleAreas;
    this.BattleEnemies = battleEnemies;
    Store.logger.info('initialize BattleArea and BattleEnemies data');

    const personLevelMap = generatePersonLevelData();
    this.personLevelMap = personLevelMap;
  }

  /**
   * 使用单例模式防止重复创建
   *
   * @static
   * @memberof Store
   */
  public static getInstance = () => {
    if (!Store.instance) {
      Store.instance = new Store();
    }
    return Store.instance;
  };
}

export const store = Store.getInstance();

export function createStore(): Promise<Store> {
  return new Promise((resolve) => resolve(store));
}

/**
 * 使用模块数据
 *
 * @export
 * @template T
 * @param {ModulePackageKey} moduleKey
 * @return {*}
 */
export function useModulePackage<T>(moduleKey: keyof typeof store) {
  return store[moduleKey] as T;
}

type IFindItemReturnType<T> = T extends EquipmentItem
  ? EquipmentItem
  : T extends RecipeItem
  ? RecipeItem
  : T extends BattleEnemyItem
  ? BattleEnemyItem
  : Item;

/**
 * 根据 id 查找物品
 */
export function findItemById<T>(itemId: string) {
  const Item = store.items.find((item) => item.id === itemId);
  invariant(Item !== undefined, 'Could not find Item id: ' + itemId);
  return Item as IFindItemReturnType<T>;
}

/**
 * 根据 id 查找配方
 */
export function findRecipeById(id: string) {
  return findItemById<RecipeItem>(id);
}

/**
 * 根据 id 查找装备
 */
export function findEquipmentById(id: string) {
  return findItemById<EquipmentItem>(id);
}

/**
 * 根据 id 查找敌人
 */
export function findEnemyById(id: string) {
  return findItemById<BattleEnemyItem>(id);
}

/**
 * 根据 level 查找具体等级
 */
export function findPersonLevelItem(level: PersonLevel) {
  const result = store.personLevelMap.get(level);
  invariant(result !== undefined, `Try to find ${level} but got undefined`);
  return result;
}

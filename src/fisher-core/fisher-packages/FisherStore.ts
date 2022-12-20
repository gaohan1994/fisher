import invariant from 'invariant';
import { FisherEquipmentItem, FisherItem, FisherRecipeItem } from '@FisherCore';
import { prefixes, prefixLogger } from '@FisherLogger';
import {
  IFisherMiningPackagesData,
  IFisherReikiPackagesData,
  makeEquipmentPackagesData,
  makeMiningPackagesData,
  makeReikiPackagesData,
} from './FisherPackages';
/**
 * 游戏模块数据库
 *
 * @class FisherStore
 */
export class FisherStore {
  public static logger = prefixLogger(prefixes.FISHER_CORE, 'FisherStore');

  public static instance: FisherStore;

  public Mining: IFisherMiningPackagesData;

  public Reiki: IFisherReikiPackagesData;

  public EmptyEquipment: FisherEquipmentItem;

  public Equipments: FisherEquipmentItem[];

  public get items() {
    return [
      ...this.Mining.items,
      ...this.Mining.recipes,
      ...this.Reiki.items,
      ...this.Reiki.recipes,
      this.EmptyEquipment,
      ...this.Equipments,
    ];
  }

  /**
   * Creates an instance of FisherStore.
   * 初始化各个模块的数据
   * @memberof FisherStore
   */
  constructor() {
    this.Mining = makeMiningPackagesData();
    FisherStore.logger.info('initialize Mining data');

    this.Reiki = makeReikiPackagesData();
    FisherStore.logger.info('initialize Reiki data');

    const { emptyEquipment, equipments } = makeEquipmentPackagesData();
    this.EmptyEquipment = emptyEquipment;
    this.Equipments = equipments;
    FisherStore.logger.info('initialize Equipments data');
  }

  /**
   * 使用单例模式防止重复创建
   *
   * @static
   * @memberof FisherStore
   */
  public static getInstance = () => {
    if (!FisherStore.instance) {
      FisherStore.instance = new FisherStore();
    }
    return FisherStore.instance;
  };
}

export const fisherStore = FisherStore.getInstance();

/**
 * 使用模块数据
 *
 * @export
 * @template T
 * @param {ModulePackageKey} moduleKey
 * @return {*}
 */
export function useModulePackage<T>(moduleKey: keyof typeof fisherStore) {
  return fisherStore[moduleKey] as T;
}

type IFindItemReturnType<T> = T extends FisherEquipmentItem
  ? FisherEquipmentItem
  : T extends FisherRecipeItem
  ? FisherRecipeItem
  : FisherItem;

/**
 * 根据 id 查找物品
 *
 * @export
 * @param {string} fisherItemId
 * @return {*}
 */
export function findFisherItemById<T>(fisherItemId: string) {
  const fisherItem = fisherStore.items.find((item) => item.id === fisherItemId);
  invariant(
    fisherItem !== undefined,
    'Could not find fisherItem id: ' + fisherItemId
  );
  return fisherItem as IFindItemReturnType<T>;
}

/**
 * 根据 id 查找配方
 *
 * @export
 * @param {string} recipeId
 * @return {*}
 */
export function findRecipeById(id: string) {
  return findFisherItemById<FisherRecipeItem>(id);
}

/**
 * 根据 id 查找装备
 *
 * @export
 * @param {string} id
 * @return {*}
 */
export function findEquipmentById(id: string) {
  return findFisherItemById<FisherEquipmentItem>(id);
}

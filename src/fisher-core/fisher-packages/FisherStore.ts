import invariant from 'invariant';
import {
  FisherBattleAreaItem,
  FisherBattleEnemyItem,
  FisherEquipmentItem,
  FisherItem,
  RecipeItem,
  PersonLevel,
  PersonLevelItem,
} from '@FisherCore';
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
 * @class FisherStore
 */
export class FisherStore {
  public static logger = prefixLogger(prefixes.FISHER_CORE, 'FisherStore');

  public static instance: FisherStore;

  public readonly Mining: IFisherMiningPackagesData;

  public readonly Reiki: IFisherReikiPackagesData;

  public readonly EmptyEquipment: FisherEquipmentItem;

  public readonly Equipments: FisherEquipmentItem[];

  public readonly BattleAreas: FisherBattleAreaItem[] = [];

  public readonly BattleEnemies: FisherBattleEnemyItem[] = [];

  public personLevelMap: Map<PersonLevel, PersonLevelItem>;

  public get items() {
    return [
      ...this.Mining.items,
      ...this.Mining.recipes,
      ...this.Reiki.items,
      ...this.Reiki.recipes,
      this.EmptyEquipment,
      ...this.Equipments,
      ...this.BattleAreas,
      ...this.BattleEnemies,
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

    const { battleAreas, battleEnemies } = makeBattlePackageData();
    this.BattleAreas = battleAreas;
    this.BattleEnemies = battleEnemies;
    FisherStore.logger.info('initialize BattleArea and BattleEnemies data');

    const personLevelMap = generatePersonLevelData();
    this.personLevelMap = personLevelMap;
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

export function createFisherStore(): Promise<FisherStore> {
  return new Promise((resolve) => resolve(fisherStore));
}

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
  : T extends RecipeItem
  ? RecipeItem
  : T extends FisherBattleEnemyItem
  ? FisherBattleEnemyItem
  : FisherItem;

/**
 * 根据 id 查找物品
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
 */
export function findRecipeById(id: string) {
  return findFisherItemById<RecipeItem>(id);
}

/**
 * 根据 id 查找装备
 */
export function findEquipmentById(id: string) {
  return findFisherItemById<FisherEquipmentItem>(id);
}

/**
 * 根据 id 查找敌人
 */
export function findEnemyById(id: string) {
  return findFisherItemById<FisherBattleEnemyItem>(id);
}

/**
 * 根据 level 查找具体等级
 */
export function findPersonLevelItem(level: PersonLevel) {
  const result = fisherStore.personLevelMap.get(level);
  invariant(result !== undefined, `Try to find ${level} but got undefined`);
  return result;
}

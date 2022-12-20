import { FisherRecipeItem, FisherSkill } from '@FisherCore';

export enum CollectionTypes {
  Mining = 'Mining',
  Reiki = 'Reiki',
}

/**
 * 采集模块抽象类
 *
 * @export
 * @abstract
 * @class CollectionModule
 */
export abstract class CollectionModule {
  /**
   * 采集类型
   *
   * @abstract
   * @type {CollectionTypes}
   * @memberof CollectionModule
   */
  public abstract id: CollectionTypes;

  public abstract get isActive(): boolean;
  public abstract set isActive(value: boolean);

  public abstract skill: FisherSkill;

  public get activeRecipe() {
    return this.skill.activeRecipe;
  }

  public get levelInfo() {
    return this.skill.levelInfo;
  }

  /**
   * 抽象开始采集接口
   *
   * @abstract
   * @param {FisherRecipeItem} value
   * @memberof CollectionModule
   */
  public abstract start(value: FisherRecipeItem): void;

  /**
   * 抽象停止采集接口
   *
   * @abstract
   * @memberof CollectionModule
   */
  public abstract stop(): void;
}

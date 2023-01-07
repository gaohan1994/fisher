import { prefixLogger, prefixes } from '@FisherLogger';
import { ICollectionModuleData } from '../fisher-packages';
import { core } from '../fisher-core';
import { Skill } from '../fisher-skill';
import { RecipeItem } from '../fisher-item';

enum CollectionModuleId {
  Reiki = 'Reiki',
  Mining = 'Mining',
}

/**
 * 采集模块抽象类
 * - 可以采集多种资源(如矿石、灵气)
 * - 可配置采集系统的种类和数据
 * - 采集具有等级系统等级越高采集效率越高
 *      - 熟练度达到下一个等级后解锁下一等级的采集效率
 *      - 采集等级每级所需熟练度递增
 *      - 采集系统每级所需熟练度 x 点采集不同种类和等级的物品获取的数量度不同 [可配置]
 *      - 每次采集提升熟练度 x 点 [可配置]
 *      - 有最高等级限制 [可配置]
 * - 采集种类
 *      - 随着等级提升逐渐开放不同种类的配方 Recipe [可配置]
 * - 采集效率
 *      - 每隔 x-ms (随着等级提高减少)收集一次物品 [可配置]
 *      - 每次收集 x 个物品(随着等级提高增加) [可配置]
 * - 初始化采集系统
 *      - 进入游戏的时候初始化采集系统
 *      - 从存档中读取采集系统的数据如经验、等级
 * - 采集
 *      - 只能有一个采集系统处于 active 状态 isActive
 *      - 切换采集模块的时候其他采集模块应该关闭
 *      - 采集后的物品存入背包 ?
 *      - 采集系统应该对接存档模块
 *
 */
export abstract class Collection {
  private static readonly logger = prefixLogger(prefixes.FISHER_CORE, 'Collection');

  static readonly CollectionModuleId = CollectionModuleId;

  public id: string;

  public abstract name: string;

  public isActive = false;

  public readonly skill: Skill;

  public abstract packages: ICollectionModuleData;

  /**
   * Creates an instance of CollectionModule.
   * 初始化抽象类
   * 创建采集技能
   */
  constructor(id: CollectionModuleId) {
    this.id = id;
    this.skill = new Skill(`${id}:Skill`);
  }

  public get activeRecipe() {
    return this.skill.activeRecipe;
  }

  public get levelInfo() {
    return this.skill.levelInfo;
  }

  /**
   * 开始采集接口
   */
  public start = (recipe: RecipeItem) => {
    this.skill.start(recipe);

    this.isActive = true;
    core.setActiveComponent(this);

    Collection.logger.info(`start collection module ${this.id}`);
  };

  /**
   * 停止采集接口
   */
  public stop = () => {
    this.skill.stop();
    this.isActive = false;

    Collection.logger.info(`stop collection module ${this.id}`);
  };
}

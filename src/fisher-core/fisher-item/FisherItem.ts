export enum ItemType {
  Test = 'Test',
  Normal = 'Normal',
  Recipe = 'Recipe',
  Equipment = 'Equipment',
  BattleArea = 'BattleArea',
  BattleEnemy = 'BattleEnemy',
  PersonLevel = 'PersonLevel',
}

export interface IFisherItem {
  readonly id: string;
  readonly name: string;
  readonly desc: string;
  readonly media: string;
  readonly price?: number;
}

export abstract class AbstractItem implements IFisherItem {
  abstract readonly type: ItemType;

  public id = '';

  public name = '';

  public desc = '';

  public media = '';
}

/**
 * Fisher 物品类
 * 只有物品才需要用该类创建
 * - 物品类应该是通用的即通过 FisherItem 创建
 * - 物品含有基础信息
 *
 * @export
 * @class FisherItem
 */
export abstract class FisherItem implements IFisherItem {
  abstract readonly type: ItemType;

  public id = '';

  public name = '';

  public desc = '';

  public media = '';

  public price = 0;

  constructor(options: IFisherItem) {
    this.id = options.id;

    this.name = options.name;

    this.desc = options.desc;

    this.media = options.media;

    if (typeof options.price === 'number') {
      this.price = options.price;
    }
  }

  public useItem() {
    throw new Error('Not implemented!');
  }
}

interface IFisherTestItem extends IFisherItem {}
export class FisherTestItem extends FisherItem {
  type = ItemType.Test;
  constructor(options: IFisherTestItem) {
    super(options);
  }
}

export class FisherNormalItem extends FisherItem {
  type = ItemType.Normal;
  constructor(options: IFisherTestItem) {
    super(options);
  }
}

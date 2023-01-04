export enum ItemType {
  Test = 'Test',
  Normal = 'Normal',
  Recipe = 'Recipe',
  Equipment = 'Equipment',
  BattleArea = 'BattleArea',
  BattleEnemy = 'BattleEnemy',
  PersonLevel = 'PersonLevel',
}

export interface IItem {
  readonly id: string;
  readonly name: string;
  readonly desc: string;
  readonly media: string;
  readonly price?: number;
}

export abstract class AbstractItem implements IItem {
  abstract readonly type: ItemType;

  public id = '';

  public name = '';

  public desc = '';

  public media = '';
}

/**
 * Fisher 物品类
 * 只有物品才需要用该类创建
 * - 物品类应该是通用的即通过 Item 创建
 * - 物品含有基础信息
 *
 * @export
 * @class Item
 */
export abstract class Item implements IItem {
  abstract readonly type: ItemType;

  public id = '';

  public name = '';

  public desc = '';

  public media = '';

  public price = 0;

  constructor(options: IItem) {
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

interface ITestItem extends IItem {}

export class TestItem extends Item {
  type = ItemType.Test;
  constructor(options: ITestItem) {
    super(options);
  }
}

export class FisherNormalItem extends Item {
  type = ItemType.Normal;
  constructor(options: ITestItem) {
    super(options);
  }
}

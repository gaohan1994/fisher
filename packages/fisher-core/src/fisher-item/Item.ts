import { Assets } from '../assets';
import { Rarity } from './Constants';

export enum ItemType {
  Test = 'Test',
  Normal = 'Normal',
  Recipe = 'Recipe',
  Equipment = 'Equipment',
  EquipmentSet = 'EquipmentSet',
  Enemy = 'Enemy',
  BattleArea = 'BattleArea',
  RewardChest = 'RewardChest',
  Potion = 'Potion',
  Seed = 'Seed',
  Soil = 'Soil',
  Dungeon = 'Dungeon',
}

export interface IItem {
  readonly id: string;
  readonly name: string;
  readonly desc: string;
  readonly media: string;
  readonly price?: number;
  rarity?: Rarity[0];
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

  public price = 0;

  private _media = '';

  public rarity: Rarity = Rarity.Common;

  public get media() {
    if (!this._media) {
      return Assets.empty;
    }
    return Assets[this._media as keyof typeof Assets];
  }

  constructor(options: IItem) {
    this.id = options.id;

    this.name = options.name;

    this.desc = options.desc;

    this._media = options.media;

    if (typeof options.price === 'number') {
      this.price = options.price;
    }

    if (options.rarity) {
      this.rarity = options.rarity as Rarity;
    }
  }

  public useItem() {
    throw new Error('Not implemented!');
  }
}

export class TestItem extends Item {
  type = ItemType.Test;
  constructor(options: IItem) {
    super(options);
  }
}

export class NormalItem extends Item {
  type = ItemType.Normal;
  constructor(options: IItem) {
    super(options);
  }
}

export interface IFisherBaseItem {
  id: string;
  name: string;
  media: string;
  desc: string;
}

/**
 * 物品基类
 *
 * @class FisherBaseItem
 */
export class FisherBaseItem {
  public id: string;
  public name: string;
  public desc: string;
  public media: string;
  constructor({ id, name, desc, media }: IFisherBaseItem) {
    this.id = id;
    this.name = name;
    this.desc = desc;
    this.media = media;
  }
}

export interface IFisherItem extends IFisherBaseItem {
  price: number;
  type: FisherItemType;
}

export enum FisherItemType {
  Test = 'Test',
  Mining = 'Mining',
  Equipment = 'Equipment',
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
export class FisherItem extends FisherBaseItem {
  public price: number;
  public type: FisherItemType;

  constructor(options: IFisherItem) {
    super(options);
    this.price = options.price;
    this.type = options.type;
  }
}

interface IFisherItem {
  id: string;
  name: string;
  price: number;
  media: string;
  desc: string;
  type: FisherItemType;
}

export enum FisherItemType {
  Test = 'Test',
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
export class FisherItem {
  public id: string;
  public name: string;
  public price: number;
  public desc: string;
  public media: string;
  public type: FisherItemType;

  constructor({ id, name, price, desc, media, type }: IFisherItem) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.desc = desc;
    this.media = media;
    this.type = type;
  }
}

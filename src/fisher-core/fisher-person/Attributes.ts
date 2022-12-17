export enum IAttributeKeys {
  // 生命值
  Hp = 'Hp',
  // 最大生命值
  MaxHp = 'MaxHp',
  // 基础攻击力
  BaseAttackPower = 'BaseAttackPower',
  // 基础攻击力增幅
  BaseAttackPowerGrowth = 'BaseAttackPowerGrowth',
  // 攻击力
  AttackPower = 'AttackPower',
  // 防御力
  // Defense = 'Defense',
}

export type IFisherPersonBaseAttributesKeys =
  | IAttributeKeys.BaseAttackPower
  | IAttributeKeys.BaseAttackPowerGrowth
  | IAttributeKeys.MaxHp;

export type IFisherPersonBaseAttributes = {
  [key in IFisherPersonBaseAttributesKeys]: number;
};

export type IFisherEquipmentAttributesKeys =
  | IAttributeKeys.AttackPower
  | IAttributeKeys.MaxHp;

export type IFisherPersonEquipmentAttributes = {
  [key in IFisherEquipmentAttributesKeys]: number;
};

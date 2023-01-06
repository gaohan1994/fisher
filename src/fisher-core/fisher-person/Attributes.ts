export enum IAttributeKeys {
  // 生命值
  Hp = 'Hp',
  // 最大生命值
  MaxHp = 'MaxHp',
  // 攻击力
  AttackPower = 'AttackPower',
  // 百分比提升攻击力
  AttackPowerMultiplier = 'AttackPowerMultiplier',
  // 防御力
  DefensePower = 'DefensePower',
  // 百分比提升防御力
  DefensePowerMultiplier = 'DefensePowerMultiplier',
  // 减甲
  DefenceCorruption = 'DefenceCorruption',
}

export type IBonusEquipmentsAttributesKeys =
  | IAttributeKeys.MaxHp
  | IAttributeKeys.AttackPower
  | IAttributeKeys.AttackPowerMultiplier
  | IAttributeKeys.DefensePower
  | IAttributeKeys.DefensePowerMultiplier
  | IAttributeKeys.DefenceCorruption;

export type IBonusEquipmentsAttributes = {
  [key in IBonusEquipmentsAttributesKeys]: number;
};

export type IFisherPersonAttributes = {
  [key in IAttributeKeys]: number;
};

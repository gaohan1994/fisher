enum IAttributeKeys {
  // 生命值
  Hp = 'Hp',
  // 最大生命值
  MaxHp = 'MaxHp',
  // 攻击力
  AttackPower = 'AttackPower',
  // 百分比提升攻击力
  AttackPowerMultiplier = 'AttackPowerMultiplier',
  // 防御力
  DefencePower = 'DefencePower',
  // 百分比提升防御力
  DefencePowerMultiplier = 'DefencePowerMultiplier',
  // 减甲
  DefenceCorruption = 'DefenceCorruption',
  // 攻速
  AttackSpeed = 'AttackSpeed',
  // 攻速加成
  AttackSpeedMultiplier = 'AttackSpeedMultiplier',
}

type IBonusAttributesKeys =
  | IAttributeKeys.MaxHp
  | IAttributeKeys.AttackPower
  | IAttributeKeys.AttackPowerMultiplier
  | IAttributeKeys.DefencePower
  | IAttributeKeys.DefencePowerMultiplier
  | IAttributeKeys.DefenceCorruption;

/**
 * Generate type
 * {
 *  [key: IBonusAttributesKeys]: number
 * }
 */
type AttributesRecordGenerator<T extends IBonusAttributesKeys> = Record<T, number>;

type IBonusEquipmentsAttributesKeys = IBonusAttributesKeys;
type IBonusEquipmentsAttributes = AttributesRecordGenerator<IBonusEquipmentsAttributesKeys>;

type IBonusPotionAttributesKeys = IBonusAttributesKeys;
type IBonusPotionAttributes = AttributesRecordGenerator<IBonusPotionAttributesKeys>;

type IBonusBuffAttributesKeys = IBonusAttributesKeys;
type IBonuesBuffAttributes = AttributesRecordGenerator<IBonusBuffAttributesKeys>;

export { IAttributeKeys };
export type {
  IBonusEquipmentsAttributesKeys,
  IBonusEquipmentsAttributes,
  IBonusPotionAttributesKeys,
  IBonusPotionAttributes,
  IBonusBuffAttributesKeys,
  IBonuesBuffAttributes,
};

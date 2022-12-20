export enum IAttributeKeys {
  // 生命值
  Hp = 'Hp',
  // 最大生命值
  MaxHp = 'MaxHp',
  // 攻击力
  AttackPower = 'AttackPower',
  // 防御力
  // Defense = 'Defense',
}

export type IFisherPersonAttributesAffectedKeys =
  | IAttributeKeys.AttackPower
  | IAttributeKeys.MaxHp;

export type IFisherPersonAttributesAffected = {
  [key in IFisherPersonAttributesAffectedKeys]: number;
};

export type IFisherPersonAttributes = {
  [key in IAttributeKeys]: number;
};

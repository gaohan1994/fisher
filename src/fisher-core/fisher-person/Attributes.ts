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

export type IBonusEquipmentsAttributesKeys =
  | IAttributeKeys.AttackPower
  | IAttributeKeys.MaxHp;

export type IBonusEquipmentsAttributes = {
  [key in IBonusEquipmentsAttributesKeys]: number;
};

export type IFisherPersonAttributes = {
  [key in IAttributeKeys]: number;
};

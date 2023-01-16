import { IAttributeKeys } from '@FisherCore';

interface FuiAttribute {
  key: IAttributeKeys;
  label: string;
  variant: FuiAttributeVariant;
}

enum FuiAttributeVariant {
  Value = 'Value',
  Percent = 'Percent',
}

const FuiAttributes = {
  [IAttributeKeys.AttackPower]: {
    key: IAttributeKeys.AttackPower,
    label: '攻击力',
    variant: FuiAttributeVariant.Value,
  },
  [IAttributeKeys.Hp]: {
    key: IAttributeKeys.Hp,
    label: '生命值',
    variant: FuiAttributeVariant.Value,
  },
  [IAttributeKeys.MaxHp]: {
    key: IAttributeKeys.MaxHp,
    label: '生命值',
    variant: FuiAttributeVariant.Value,
  },
  [IAttributeKeys.AttackPower]: {
    key: IAttributeKeys.AttackPower,
    label: '攻击力',
    variant: FuiAttributeVariant.Value,
  },
  [IAttributeKeys.AttackPowerMultiplier]: {
    key: IAttributeKeys.AttackPowerMultiplier,
    label: '攻击力',
    variant: FuiAttributeVariant.Percent,
  },
  [IAttributeKeys.DefencePower]: {
    key: IAttributeKeys.DefencePower,
    label: '防御力',
    variant: FuiAttributeVariant.Value,
  },
  [IAttributeKeys.DefencePowerMultiplier]: {
    key: IAttributeKeys.DefencePowerMultiplier,
    label: '防御力',
    variant: FuiAttributeVariant.Percent,
  },
  [IAttributeKeys.DefenceCorruption]: {
    key: IAttributeKeys.DefenceCorruption,
    label: '减甲',
    variant: FuiAttributeVariant.Value,
  },
};

function makeFuiAttribute(key: IAttributeKeys): FuiAttribute {
  return FuiAttributes[key];
}

function makeFuiAttributeText(key: IAttributeKeys[number], value: number): string {
  const fuiAttribute = makeFuiAttribute(key as IAttributeKeys);
  const sign = value >= 0 ? '+' : '-';

  let suffix = '';
  if (fuiAttribute.variant === FuiAttributeVariant.Percent) {
    suffix = '%';
  }
  return `${fuiAttribute.label} ${sign}${value}${suffix}`;
}

export { makeFuiAttribute, makeFuiAttributeText };

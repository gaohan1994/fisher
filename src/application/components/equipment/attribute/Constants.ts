import { IAttributeKeys } from '@FisherCore';

interface FuiAttribute {
  key: IAttributeKeys;
  label: string;
  variant: FuiAttributeVariant;
}
export enum FuiAttributeVariant {
  Value = 'Value',
  Percent = 'Percent',
}
export const AttributeConstants: Record<IAttributeKeys, FuiAttribute> = {
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
  [IAttributeKeys.AttackSpeed]: {
    key: IAttributeKeys.AttackSpeed,
    label: '攻击速度',
    variant: FuiAttributeVariant.Value,
  },
  [IAttributeKeys.AttackSpeedMultiplier]: {
    key: IAttributeKeys.AttackSpeedMultiplier,
    label: '攻速加成',
    variant: FuiAttributeVariant.Percent,
  },
  [IAttributeKeys.Hp]: {
    key: IAttributeKeys.Hp,
    label: '生命值',
    variant: FuiAttributeVariant.Value,
  },
  [IAttributeKeys.MaxHp]: {
    key: IAttributeKeys.MaxHp,
    label: '最大生命值',
    variant: FuiAttributeVariant.Value,
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

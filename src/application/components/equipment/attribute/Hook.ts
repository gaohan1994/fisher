import numeral from 'numeral';
import { IAttributeKeys, IEquipmentAttribute } from '@FisherCore';
import { AttributeConstants, FuiAttributeVariant } from './Constants';

/**
 * Return attribute display value
 * @param attribute
 * @returns
 */
export const useAttributeDisplayValue = (attribute: IEquipmentAttribute) => {
  const { key, value } = attribute;
  const { label, variant } = AttributeConstants[attribute.key as IAttributeKeys];

  if (key === IAttributeKeys.AttackSpeed) {
    return `${label} ${numeral(value / 1000).format('0.0')}`;
  }

  const sign = value >= 0 ? '+' : '-';

  let suffix = '';
  if (variant === FuiAttributeVariant.Percent) {
    suffix = '%';
  }

  return `${label} ${sign}${value}${suffix}`;
};

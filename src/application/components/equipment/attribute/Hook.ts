import numeral from 'numeral';
import { IAttributeKeys, IEquipmentAttribute } from '@FisherCore';
import { FuiAttributeVariant, useAttributeConstant } from '../../attribute';

/**
 * Return attribute display value
 * @param attribute
 * @returns
 */
export const useAttributeDisplayValue = (attribute: IEquipmentAttribute) => {
  const { label, variant } = useAttributeConstant(attribute);
  const { key, value } = attribute;

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

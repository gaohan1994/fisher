import { IAttributeKeys, IEquipmentAttribute } from '@FisherCore';
import { AttributeConstants } from './Constants';

/**
 * Return passed attribute constant
 * @param attribute
 * @returns
 */
export const useAttributeConstant = (attribute: IEquipmentAttribute) => {
  return AttributeConstants[attribute.key as IAttributeKeys];
};

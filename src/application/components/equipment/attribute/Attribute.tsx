import { FC } from 'react';
import { IEquipmentAttribute } from '@FisherCore';

import { EquipmentColorText } from '../Styled';
import { useAttributeDisplayValue } from './Hook';

interface AttributeProps {
  attribute: IEquipmentAttribute;
  active: boolean;
}
export const Attribute: FC<AttributeProps> = ({ attribute, active }) => {
  const displayValue = useAttributeDisplayValue(attribute);
  return (
    <EquipmentColorText active={active} sx={{ display: 'block' }}>
      {displayValue}
    </EquipmentColorText>
  );
};

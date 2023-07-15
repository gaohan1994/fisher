import { FC } from 'react';
import { IEquipmentAttribute } from '@FisherCore';

import { EquipmentContentBox } from '../Styled';
import { Attribute } from './Attribute';

interface AttributesProps {
  attributes: IEquipmentAttribute[];
  active?: boolean;
}
export const Attributes: FC<AttributesProps> = ({ attributes, active = true }) => (
  <EquipmentContentBox id="equipment-attributes">
    {attributes.map((item, index) => (
      <Attribute key={`${item.key}-${item.value}-${index}`} attribute={item} active={active} />
    ))}
  </EquipmentContentBox>
);

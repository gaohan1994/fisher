import { FC, Fragment } from 'react';
import { EquipmentItem } from '@FisherCore';

import { FuiColor } from '../../theme';
import { makeFuiAttributeBonusText } from '../../attribute';

import { EquipmentText } from './Common';
import { useEquipmentAttributes } from './Hook';

interface IEquipmentAttributes {
  equipment: EquipmentItem;
}
export const EquipmentAttributes: FC<IEquipmentAttributes> = ({ equipment }) => {
  const attributes = useEquipmentAttributes(equipment);
  return (
    <Fragment>
      {attributes.map((attribute) => (
        <EquipmentText key={attribute.key} color={FuiColor.equipment.attribute}>
          {makeFuiAttributeBonusText(attribute.key, attribute.value)}
        </EquipmentText>
      ))}
    </Fragment>
  );
};

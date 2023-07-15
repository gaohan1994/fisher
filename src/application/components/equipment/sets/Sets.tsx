import { FC, Fragment } from 'react';
import { EquipmentSet } from '@FisherCore';

import { FuiColor } from '../../theme';
import { Attributes } from '../attribute';
import { EquipmentColorText, EquipmentText } from '../Styled';
import { EquipmentSetBox } from './Styled';
import { useSetActiveEquipmentsDisplayValue, useSetIncludeEquipments } from './Hook';

interface SetsProps {
  equipmentSet: EquipmentSet;
}
export const Sets: FC<SetsProps> = ({ equipmentSet }) => {
  const { name, setAttributes } = equipmentSet;
  const activeEquipmentDisplayValue = useSetActiveEquipmentsDisplayValue(equipmentSet);
  const includeEquipments = useSetIncludeEquipments(equipmentSet);
  return (
    <EquipmentSetBox>
      <EquipmentText color={FuiColor.equipmentSet.activeName}>
        {name} {activeEquipmentDisplayValue}
      </EquipmentText>
      {includeEquipments.map(([item, active]) => (
        <EquipmentColorText key={`${equipmentSet.id}-${item.id}-${active}`} active={active} sx={{ display: 'block' }}>
          {item.name}
        </EquipmentColorText>
      ))}
      {setAttributes.map(([{ slot, active }, attributes]) => (
        <Fragment key={`${slot}-${active}`}>
          <EquipmentColorText active={active}>{`套装属性(${slot})`}</EquipmentColorText>
          <Attributes active={active} attributes={attributes} />
        </Fragment>
      ))}
    </EquipmentSetBox>
  );
};

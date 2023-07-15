import { FC, Fragment } from 'react';
import { observer } from 'mobx-react';
import { Box } from '@mui/material';
import { EquipmentItem, EquipmentSetSlotControl, IEquipmentAttribute } from '@FisherCore';

import { makeFuiAttributeBonusText } from '../../attribute';
import { FuiColor } from '../../theme';

import { EquipmentText } from './Common';
import { useEquipmentSet, useEquipmentSetIncludeEquipments } from './Hook';

const getTextColor = (active: boolean) =>
  active ? FuiColor.equipmentSet.activeValue : FuiColor.equipmentSet.inactiveValue;

interface Props {
  equipment: EquipmentItem;
}
const FuiEquipmentSet: FC<Props> = observer(({ equipment }) => {
  const equipmentSet = useEquipmentSet(equipment);
  const includeEquipments = useEquipmentSetIncludeEquipments(equipmentSet);
  return (
    <Box sx={{ width: '100%', p: 1, bgcolor: FuiColor.equipmentSet.background }}>
      <EquipmentText color={FuiColor.equipmentSet.activeName}>
        {equipmentSet.name} {`(${equipmentSet.activeEquipmentLength}/${equipmentSet.equipmentIdSet.size})`}
      </EquipmentText>
      {includeEquipments.map(([item, active]) => (
        <IncludeEquipment key={`${equipmentSet.id}-${item.id}-${active}`} equipment={item} active={active} />
      ))}
      {equipmentSet.setAttributes.map(([setSlotControl, setAttributes]) => (
        <FuiEquipmentSlot
          key={`${setSlotControl.slot}-${setSlotControl.active}`}
          slotControl={setSlotControl}
          attributes={setAttributes}
        />
      ))}
      {equipmentSet.hasExtraAttributes && (
        <FuiEquipmentSlot
          key={`extra-${equipmentSet.extra!.setSlotControl.slot}-${equipmentSet.extra!.setSlotControl.active}`}
          slotControl={equipmentSet.extra!.setSlotControl}
          attributes={equipmentSet.extra!.attributes}
        />
      )}
    </Box>
  );
});

interface IIncludeEquipment {
  active: boolean;
  equipment: EquipmentItem;
}
const IncludeEquipment: FC<IIncludeEquipment> = ({ active, equipment }) => (
  <EquipmentText color={getTextColor(active)}>{equipment.name}</EquipmentText>
);

interface IEquipmentSlot {
  slotControl: EquipmentSetSlotControl;
  attributes: IEquipmentAttribute[];
}
const FuiEquipmentSlot: FC<IEquipmentSlot> = ({ slotControl, attributes }) => (
  <Fragment>
    <EquipmentText color={getTextColor(slotControl.active)}>套装属性({slotControl.slot})</EquipmentText>
    <FuiEquipmentSlotAttributes active={slotControl.active} attributes={attributes} />
  </Fragment>
);

interface IFuiEquipmentSlotAttributes {
  active: boolean;
  attributes: IEquipmentAttribute[];
}
const FuiEquipmentSlotAttributes: FC<IFuiEquipmentSlotAttributes> = ({ active, attributes }) => (
  <Fragment>
    {attributes.map((attribute, index) => (
      <EquipmentText key={index} color={getTextColor(active)} sx={{ pl: 1 }}>
        {makeFuiAttributeBonusText(attribute.key, attribute.value)}
      </EquipmentText>
    ))}
  </Fragment>
);

export { FuiEquipmentSet };

import { FC, Fragment } from 'react';
import { observer } from 'mobx-react';
import { Typography, Box } from '@mui/material';
import { EquipmentSet, store } from '@FisherCore';
import { makeFuiAttributeBonusText } from '../../attribute';
import { FuiColor } from '../../theme';

interface Props {
  equipmentSet: EquipmentSet;
}

const ColorEquipmentSetTypography = ({ color, value }: any) => (
  <Typography variant="caption" component="div" sx={{ pl: 1 }} color={color}>
    {value}
  </Typography>
);

const FuiEquipmentSet: FC<Props> = observer(({ equipmentSet }) => (
  <Box sx={{ width: '100%', pl: 1, bgcolor: FuiColor.equipmentSet.background }}>
    <Typography variant="caption" color={FuiColor.equipmentSet.activeName}>
      {equipmentSet.name} {`(${equipmentSet.activeEquipmentLength}/${equipmentSet.equipmentIdSet.size})`}
    </Typography>
    {equipmentSet.equipmentIds.map((id) => {
      const equipment = store.findEquipmentById(id);
      const isEquipmentActive = equipmentSet.checkEquipmentIsActive(equipment);
      return (
        <ColorEquipmentSetTypography
          key={id}
          value={equipment.name}
          color={isEquipmentActive ? FuiColor.equipmentSet.activeValue : FuiColor.equipmentSet.inactiveValue}
        />
      );
    })}
    {equipmentSet.setAttributes.map(([setSlotControl, setAttributes]) => (
      <Fragment key={setSlotControl.slot}>
        <Typography
          variant="caption"
          color={setSlotControl.active ? FuiColor.equipmentSet.activeName : FuiColor.equipmentSet.inactiveName}
        >
          套装属性({setSlotControl.slot})
        </Typography>
        {setAttributes.map((attribute, index) => (
          <ColorEquipmentSetTypography
            key={index}
            value={makeFuiAttributeBonusText(attribute.key, attribute.value)}
            color={setSlotControl.active ? FuiColor.equipmentSet.activeValue : FuiColor.equipmentSet.inactiveValue}
          />
        ))}
      </Fragment>
    ))}
    {equipmentSet.hasExtraAttributes && <Fragment></Fragment>}
  </Box>
));

export { FuiEquipmentSet };

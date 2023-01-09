import { FC, Fragment, useState } from 'react';
import { observer } from 'mobx-react';
import { Box, colors, Stack, Typography } from '@mui/material';
import { EquipmentItem, findEquipmentSetById } from '@FisherCore';
import { FuiItem } from '../item';

interface FuiEquipmentProps {
  equipment: EquipmentItem;
}

export const FuiEquipment: FC<FuiEquipmentProps> = observer(({ equipment }) => {
  const renderEquipmentPopover = () => {
    return <Stack direction="column">{renderEquipmentSet()}</Stack>;
  };

  const renderEquipmentSet = () => {
    if (!equipment.hasEquipmentSet) {
      return null;
    }

    const equipmentSet = findEquipmentSetById(equipment.equipmentSetId ?? '');
    return (
      <Fragment>
        {equipmentSet.setAttributes.map(([setSlotControl, setAttributes]) => {
          const fontProps: any = setSlotControl.active ? { color: colors.amber.A700 } : { color: colors.blueGrey.A100 };

          return (
            <Box key={setSlotControl.slot}>
              <Typography sx={fontProps}>{setSlotControl.slot}件套</Typography>
              {setAttributes.map((attribute, index) => (
                <Typography key={index} sx={fontProps}>
                  {attribute.key}: {attribute.value}
                </Typography>
              ))}
            </Box>
          );
        })}
      </Fragment>
    );
  };

  return <FuiItem item={equipment} renderPopover={renderEquipmentPopover} />;
});

import { FC, Fragment } from 'react';
import { EquipmentItem } from '@FisherCore';
import { Box } from '@mui/material';

import { FuiColor } from '../../theme';

import { EquipmentText } from './Common';
import { useEquipmentActions } from './Hook';

interface IFuiEquipmentActions {
  equipment: EquipmentItem;
}
export const FuiEquipmentActions: FC<IFuiEquipmentActions> = ({ equipment }) => {
  const actions = useEquipmentActions(equipment);
  return (
    <Fragment>
      {actions.map((action) => (
        <Box key={action.id}>
          <EquipmentText color={FuiColor.equipment.action}>{`特效 · ${action.name}`}</EquipmentText>
          <EquipmentText color={FuiColor.equipment.action}>{action.desc}</EquipmentText>
        </Box>
      ))}
    </Fragment>
  );
};

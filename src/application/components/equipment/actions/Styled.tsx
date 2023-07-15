import { Box, styled } from '@mui/material';
import { FuiColor } from '../../theme';

export const EquipmentActionsBox = styled(Box)(() => ({
  '& #equipment-text': {
    color: FuiColor.equipment.action,
    display: 'block',
  },
}));

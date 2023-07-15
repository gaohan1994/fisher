import { styled, Box } from '@mui/material';
import { FuiColor } from '../../theme';

export const EquipmentSetBox = styled(Box)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(1),
  backgroundColor: FuiColor.equipmentSet.background,
  '& #equipment-attributes': {
    paddingLeft: theme.spacing(1),
  },
}));

import { Box, styled, Typography, TypographyProps } from '@mui/material';
import { FuiColor } from '../theme';

export const EquipmentText = styled((props: TypographyProps) => (
  <Typography id="equipment-text" variant="caption" component="span" {...props} />
))(() => ({ fontWeight: 'bold' }));

interface EquipmentColorTextProps extends TypographyProps {
  active: boolean;
}
export const EquipmentColorText = styled(({ active, ...rest }: EquipmentColorTextProps) => <EquipmentText {...rest} />)(
  ({ active }) => ({
    color: active ? FuiColor.equipmentSet.activeValue : FuiColor.equipmentSet.inactiveValue,
  })
);

export const EquipmentContentBox = styled(Box)(({ theme }) => ({
  paddingVertical: theme.spacing(1),
}));

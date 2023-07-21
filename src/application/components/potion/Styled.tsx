import { Menu, MenuProps, styled } from '@mui/material';
import { ModuleCard } from '../layout';

export const PotionManagerCard = styled(ModuleCard)(() => ({
  '& #module-card-content': {
    padding: 0,
  },
}));

export const PotionManagerMenu = styled(({ ...rest }: MenuProps) => (
  <Menu
    id="potion-manager-menu"
    keepMounted
    anchorOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...rest}
  />
))(() => ({}));

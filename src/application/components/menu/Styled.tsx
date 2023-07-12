import { blueGrey, common } from '@mui/material/colors';
import { Avatar, Drawer, MenuItem, Theme, styled } from '@mui/material';

export const MenuIcon = styled(Avatar)(() => ({ width: 34, height: 34 }));

export const MenuDrawer = styled(Drawer)(() => ({
  width: 140,
  flexShrink: 0,
  [`& .MuiDrawer-paper`]: {
    width: 140,
    boxSizing: 'border-box',
  },
}));

export const MenuItemContainer = styled(({ isActive, ...rest }: any) => <MenuItem {...rest} />)(
  ({ theme, isActive }: { theme: Theme; isActive: boolean }) => ({
    justifyContent: 'space-between',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    backgroundColor: isActive ? blueGrey[900] : 'transparent',
    color: isActive ? common.white : blueGrey.A200,
  })
);

import { FuiAppbar, FuiMenu } from '@Components';
import { Box, Toolbar } from '@mui/material';
import { Outlet } from 'react-router-dom';

const Game = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <FuiAppbar />
      <FuiMenu />
      <Box component="main" sx={{ flexGrow: 1, p: 2 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export { Game };

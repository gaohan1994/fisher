import { Outlet } from 'react-router-dom';
import { Box, Toolbar } from '@mui/material';
import { FuiAppbar, FuiMenu, FuiMiniFight } from '@Fui';
import { BrowserHiddenDetector } from '../detector';

const Game = () => (
  <Box sx={{ display: 'flex' }}>
    <BrowserHiddenDetector />
    <FuiAppbar />
    <FuiMenu />
    <FuiMiniFight />
    <Box component="main" sx={{ flexGrow: 1, p: 2 }}>
      <Toolbar />
      <Outlet />
    </Box>
  </Box>
);

export { Game };

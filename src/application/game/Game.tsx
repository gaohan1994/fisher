import { FuiAppbar, FuiMenu } from '@Components';
import { Box, Toolbar } from '@mui/material';

const Game = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <FuiAppbar />
      <FuiMenu />
      <Box component="main" sx={{ flexGrow: 1, p: 2 }}>
        <Toolbar />
        asdasd
      </Box>
    </Box>
  );
};

export { Game };

import { FC } from 'react';
import { Box, Paper } from '@mui/material';
import { FisherTimerDemo } from './FisherTimerDemo';
import { FisherGoldDemo } from './FisherGoldDemo';
import { FisherLauncher } from './FisherLauncher';

export const FisherCoreDemo: FC = () => (
  <Box
    sx={{
      display: 'flex',
      flexWrap: 'wrap',
      '& > :not(style)': {
        m: 1,
        p: 1,
        minWidth: 200,
      },
    }}
  >
    <FisherLauncher />
    <Paper>
      <FisherTimerDemo />
    </Paper>
    <Paper>
      <FisherGoldDemo />
    </Paper>
  </Box>
);

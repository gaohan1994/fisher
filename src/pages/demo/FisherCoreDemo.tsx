import { FC, PropsWithChildren } from 'react';
import { Paper, Stack } from '@mui/material';
import { FisherTimerDemo } from './FisherTimerDemo';
import { FisherGoldDemo } from './FisherGoldDemo';
import { FisherLauncher } from './FisherLauncher';
import { FisherBackpackDemo } from './FisherBackpackDemo';

const DemoStack: FC<PropsWithChildren> = ({ children }) => (
  <Stack
    p={1}
    spacing={2}
    direction="row"
    justifyContent="flex-start"
    alignItems="flex-start"
  >
    {children}
  </Stack>
);

export const FisherCoreDemo: FC = () => (
  <Stack direction="column" spacing={2}>
    <DemoStack>
      <FisherLauncher />
      <Paper>
        <FisherTimerDemo />
      </Paper>
      <Paper>
        <FisherGoldDemo />
      </Paper>
    </DemoStack>
    <DemoStack>
      <Paper
        elevation={2}
        sx={{
          minWidth: 350,
        }}
      >
        <FisherBackpackDemo />
      </Paper>
    </DemoStack>
  </Stack>
);
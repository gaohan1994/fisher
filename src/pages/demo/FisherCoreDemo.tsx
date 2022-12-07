import { FC, PropsWithChildren } from 'react';
import { Paper, Stack } from '@mui/material';
import { FisherTimerDemo } from './FisherTimerDemo';
import { FisherGoldDemo } from './FisherGoldDemo';
import { FisherBackpackDemo } from './FisherBackpackDemo';
import { FisherRewardDemo } from './FisherRewardDemo';
import { ExperienceDemo } from './ExperienceDemo';
import { ActionControlDemo } from './ActionControlDemo';

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

const FisherCoreDemo: FC = () => (
  <Stack direction="column" spacing={2}>
    <DemoStack>
      <Paper>
        <FisherTimerDemo />
      </Paper>
      <Paper>
        <FisherGoldDemo />
      </Paper>
      <Paper>
        <FisherRewardDemo />
      </Paper>
      <Paper>
        <ExperienceDemo />
      </Paper>
    </DemoStack>
    <DemoStack>
      <Paper>
        <ActionControlDemo />
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
export default FisherCoreDemo;

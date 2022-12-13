import { FC, PropsWithChildren } from 'react';
import { Paper, Stack } from '@mui/material';
import { FisherTimerDemo } from './FisherTimerDemo';
import { FisherGoldDemo } from './FisherGoldDemo';
import { FisherBackpackDemo } from './FisherBackpackDemo';
import { FisherRewardDemo } from './FisherRewardDemo';
import { ExperienceDemo } from './ExperienceDemo';
import { MiningDemo } from './MiningDemo';
import { ReikiDemo } from './ReikiDemo';

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
        <MiningDemo />
      </Paper>
      <Paper>
        <ReikiDemo />
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
  </Stack>
);
export default FisherCoreDemo;

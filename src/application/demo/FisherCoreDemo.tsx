import { FC, PropsWithChildren } from 'react';
import { Box, Paper, Stack } from '@mui/material';
import { FisherTimerDemo } from './FisherTimerDemo';
import { FisherGoldDemo } from './FisherGoldDemo';
import { FisherBackpackDemo } from './FisherBackpackDemo';
import { FisherRewardDemo } from './FisherRewardDemo';
import { ExperienceDemo } from './ExperienceDemo';
import { MiningDemo } from './MiningDemo';
import { ReikiDemo } from './ReikiDemo';
import { FisherBattleDemo } from './FisherBattleDemo';
import { StoreDemo } from './StoreDemo';
import { ForgeDemo } from './ForgeDemo';
import { FuiMiniBar } from '@Fui';

const DemoStack: FC<PropsWithChildren> = ({ children }) => (
  <Stack p={1} spacing={2} direction="row" justifyContent="flex-start" alignItems="flex-start">
    {children}
  </Stack>
);

const FisherCoreDemo: FC = () => (
  <Stack direction="column" spacing={2}>
    <FuiMiniBar />
    <DemoStack>
      <Paper>
        <FisherBattleDemo />
      </Paper>
    </DemoStack>
    <DemoStack>
      <StoreDemo />
    </DemoStack>
    <DemoStack>
      <ForgeDemo />
    </DemoStack>
    <DemoStack>
      <Paper>
        <MiningDemo />
      </Paper>
      <Paper>
        <ReikiDemo />
      </Paper>
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

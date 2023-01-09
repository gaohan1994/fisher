import { FC, PropsWithChildren } from 'react';
import { Container, Paper, Stack, Typography } from '@mui/material';
import { core } from '@FisherCore';
import { FisherTimerDemo } from './FisherTimerDemo';
import { FisherGoldDemo } from './FisherGoldDemo';
import { FisherBackpackDemo } from './FisherBackpackDemo';
import { FisherRewardDemo } from './FisherRewardDemo';
import { ExperienceDemo } from './ExperienceDemo';
import { MiningDemo } from './MiningDemo';
import { ReikiDemo } from './ReikiDemo';
import { FisherPersonDemo } from './FisherPersonDemo';
import { FisherPersonLevelDemo } from './FisherPersonLevelDemo';
import { FisherBattleDemo } from './FisherBattleDemo';
import { FisherPromptDemo } from './FisherPromptDemo';
import { StoreDemo } from './StoreDemo';

const DemoStack: FC<PropsWithChildren> = ({ children }) => (
  <Stack p={1} spacing={2} direction="row" justifyContent="flex-start" alignItems="flex-start">
    {children}
  </Stack>
);

const FisherCoreDemo: FC = () => (
  <Stack direction="column" spacing={2}>
    <DemoStack>
      <Paper>
        <FisherPersonDemo person={core.master} />
      </Paper>
      <Paper>
        <FisherBattleDemo />
      </Paper>
    </DemoStack>
    <DemoStack>
      <StoreDemo />
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
        <FisherPersonLevelDemo />
      </Paper>
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
    <FisherPromptDemo />
  </Stack>
);
export default FisherCoreDemo;

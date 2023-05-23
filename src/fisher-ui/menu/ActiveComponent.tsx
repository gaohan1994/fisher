import React from 'react';
import { observer } from 'mobx-react';
import { LinearProgress, Typography } from '@mui/material';
import { Timer } from '@FisherCore';

interface IFuiActiveComponentMiniDashboard {
  timer?: Timer;
}
const FuiActiveComponentMiniDashboard: React.FC<IFuiActiveComponentMiniDashboard> = observer(({ timer }) => (
  <React.Fragment>
    <Typography variant="caption" color="secondary">
      正在进行中
    </Typography>
    {timer && <LinearProgress variant="determinate" color="secondary" value={timer.progress} />}
  </React.Fragment>
));

export { FuiActiveComponentMiniDashboard };

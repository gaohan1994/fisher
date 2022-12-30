import { useEffect, useState, FC } from 'react';
import { observer } from 'mobx-react';
import { Button, Stack, LinearProgress } from '@mui/material';
import { FisherProgressTimer, FisherTimer } from '@FisherCore';
import { prefixLogger } from '@FisherLogger';
import { DemoLayout } from './DemoLayout';

const logger = prefixLogger('FisherCoreDemo');

export const FisherTimerDemo: FC = observer(() => {
  const [sum, setSum] = useState(0);

  const [timer] = useState(
    new FisherProgressTimer({
      action: () => setSum((prevSum) => ++prevSum),
    })
  );

  const [unPorgressTimer] = useState(
    () =>
      new FisherTimer('FisherTimerDemo', () => {
        console.log('unPorgressTimer');
      })
  );

  const [onceTimer] = useState(
    () =>
      new FisherTimer(
        'FisherTimerDemo',
        () => {
          console.log('onceTimer');
        },
        { once: true }
      )
  );

  useEffect(() => {
    logger.info('initialize timer demo');
    return () => {
      timer.stopTimer();
    };
  }, []);

  return (
    <DemoLayout title="FisherTimerDemo">
      <div>Timer status: {timer.active ? 'active' : 'inActive'}</div>
      <div>sum: {sum}</div>
      <LinearProgress variant="determinate" value={timer.progress} />
      <Stack direction="row" spacing={1}>
        <Button variant="contained" onClick={() => timer.startTimer(3000)}>
          startTimer
        </Button>
        <Button variant="contained" onClick={() => timer.stopTimer()}>
          stopTimer
        </Button>
      </Stack>

      <Button onClick={() => unPorgressTimer.startTimer(1000)}>
        UnProgress Timer
      </Button>
      <Button onClick={() => onceTimer.startTimer(1000)}>Once Timer</Button>
    </DemoLayout>
  );
});

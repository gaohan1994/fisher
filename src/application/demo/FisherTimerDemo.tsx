import { useEffect, useState, FC } from 'react';
import { observer } from 'mobx-react';
import { Button, Stack, LinearProgress } from '@mui/material';
import { Timer } from '@FisherCore';
import { DemoLayout } from './DemoLayout';

export const FisherTimerDemo: FC = observer(() => {
  const [sum, setSum] = useState(0);

  const [timer] = useState(new Timer('TestTimer', () => setSum((prevSum) => ++prevSum), { showProgress: true }));

  useEffect(() => {
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
        <Button onClick={() => timer.startTimer(3000)}>startTimer</Button>
        <Button onClick={() => timer.stopTimer()}>stopTimer</Button>
      </Stack>
    </DemoLayout>
  );
});

import { useEffect, useState, FC } from 'react';
import { observer } from 'mobx-react';
import {
  Button,
  Stack,
  Box,
  Paper,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { FisherTimer } from '@FisherCore';
import { prefixLogger } from '@FisherLogger';

const logger = prefixLogger('FisherCoreDemo');

const FisherTimerDemo: FC = observer(() => {
  const [sum, setSum] = useState(0);
  const [fireImmediately, setFireImmediately] = useState(true);

  const [timer] = useState(
    new FisherTimer({
      action: () => setSum((prevSum) => ++prevSum),
      fireImmediately,
    })
  );

  useEffect(() => {
    timer.fireImmediately = fireImmediately;
  }, [fireImmediately]);

  useEffect(() => {
    logger.info('initialize timer demo');
    return () => {
      timer.stopTimer();
    };
  }, []);

  return (
    <div>
      <h3>FisherTimerDemo</h3>
      <div>Timer status: {timer.active ? 'active' : 'inActive'}</div>
      <div>sum: {sum}</div>
      <FormControlLabel
        label={`fireImmediately: ${fireImmediately ? 'open' : 'false'}`}
        control={
          <Checkbox
            checked={fireImmediately}
            onChange={(event) => setFireImmediately(event.target.checked)}
          />
        }
      />
      <Stack direction="row" spacing={1}>
        <Button variant="contained" onClick={() => timer.startTimer(1000)}>
          startTimer
        </Button>
        <Button variant="contained" onClick={() => timer.stopTimer()}>
          stopTimer
        </Button>
      </Stack>
    </div>
  );
});

export const FisherCoreDemo: FC = () => {
  return (
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
      <Paper>
        <FisherTimerDemo />
      </Paper>
    </Box>
  );
};

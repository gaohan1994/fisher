import { FC, useState } from 'react';
import { observer } from 'mobx-react';
import { DemoLayout } from './DemoLayout';
import { Button, TextField } from '@mui/material';
import { core } from '@FisherCore';

export const FisherGoldDemo: FC = observer(() => {
  const [receiveGoldNumber, setReceiveGoldNumber] = useState('');
  const { bank } = core;

  return (
    <DemoLayout title="FisherGoldDemo">
      <div>current gold: {bank.gold}</div>
      <div>
        <TextField
          margin="normal"
          id="outlined-number"
          label="Number"
          type="number"
          InputLabelProps={{
            shrink: true,
          }}
          value={receiveGoldNumber}
          onChange={(event) => setReceiveGoldNumber(event.target.value)}
        />
      </div>
      <Button
        fullWidth={true}
        variant="contained"
        onClick={() => bank.receiveGold(Number(receiveGoldNumber))}
      >
        receive gold
      </Button>
    </DemoLayout>
  );
});

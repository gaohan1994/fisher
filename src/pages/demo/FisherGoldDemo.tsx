import { FC, useState } from 'react';
import { observer } from 'mobx-react';
import { FisherGold } from '@FisherCore';
import { DemoLayout } from './DemoLayout';
import { Button, TextField } from '@mui/material';

export const FisherGoldDemo: FC = observer(() => {
  const [fisherGold] = useState(new FisherGold({}));
  const [receiveGoldNumber, setReceiveGoldNumber] = useState('');

  return (
    <DemoLayout title="FisherGoldDemo">
      <div>current gold: {fisherGold.gold}</div>
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
        onClick={() => fisherGold.receiveGold(Number(receiveGoldNumber))}
      >
        receive gold
      </Button>
    </DemoLayout>
  );
});

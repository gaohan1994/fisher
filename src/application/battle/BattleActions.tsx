import React from 'react';
import { Button } from '@mui/material';
import { observer } from 'mobx-react';
import { core } from '@FisherCore';

const FuiBattleStopButton: React.FC = observer(() => {
  const { battle } = core;
  return (
    <Button variant="contained" color="error" onClick={battle.stop}>
      逃跑
    </Button>
  );
});

export { FuiBattleStopButton };

import { FC } from 'react';
import { Fight } from '@FisherCore';
import { useFightRecords } from './FightRecordHook';
import { Button, Card, CardActions, CardContent, List, ListItem, ListItemText, Typography } from '@mui/material';

interface IFuiFightRecords {
  fight: Fight;
}
const FuiFightRecords: FC<IFuiFightRecords> = ({ fight }) => {
  const { records, clear } = useFightRecords(fight);

  return (
    <Card>
      <CardContent sx={{ height: 300, overflow: 'auto' }}>{records}</CardContent>
      <CardActions sx={{ p: 2 }}>
        <Button disabled={records.length <= 0} onClick={clear} color="warning">
          清空战斗日志
        </Button>
      </CardActions>
    </Card>
  );
};

export { FuiFightRecords };

import { FC } from 'react';
import { observer } from 'mobx-react';
import { Avatar, Card, CardHeader, LinearProgress, Stack } from '@mui/material';
import { Person } from '@FisherCore';
import { usePersonProgressValue } from '../FightHook';

interface IFuiMiniFightPerson {
  avatar: string;
  person: Person;
}
const FuiMiniFightPerson: FC<IFuiMiniFightPerson> = observer(({ avatar, person }) => {
  const { hpProgressValue, actionProgressValue } = usePersonProgressValue(person);
  const linearProgressProps = {
    sx: { width: 100, height: 5 },
  };
  return (
    <Card sx={{ bgcolor: 'transparent' }}>
      <CardHeader
        avatar={<Avatar src={avatar} sx={{ width: 34, height: 34 }} />}
        title={
          <Stack spacing={1}>
            <LinearProgress {...linearProgressProps} variant="determinate" color="error" value={hpProgressValue} />
            <LinearProgress
              {...linearProgressProps}
              variant="determinate"
              color="progress"
              value={actionProgressValue}
            />
          </Stack>
        }
      />
    </Card>
  );
});

export { FuiMiniFightPerson };

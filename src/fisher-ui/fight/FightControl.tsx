import React from 'react';
import { observer } from 'mobx-react';
import numeral from 'numeral';
import { Box, ListItem, ListItemText, Typography } from '@mui/material';
import { Person } from '@FisherCore';
import { FuiLineProgress } from '@Fui';
import { usePersonProgressValue } from './FightHook';

interface IFuiFightControl {
  person: Person;
}
const FuiFightControl: React.FC<IFuiFightControl> = observer(({ person }) => {
  const { hpProgressValue, actionProgressValue } = usePersonProgressValue(person);
  return (
    <React.Fragment>
      <FightListItem title="生命值">
        <FuiLineProgress
          value={hpProgressValue}
          color="progressHp"
          label={<Typography variant="caption">{`${person.Hp}/${person.attributePanel.MaxHp}`}</Typography>}
        />
      </FightListItem>
      <FightListItem title="攻速">
        <FuiLineProgress
          value={actionProgressValue}
          color="progress"
          label={<Typography variant="caption">{numeral(actionProgressValue).format('0')}%</Typography>}
        />
      </FightListItem>
    </React.Fragment>
  );
});

interface IFightListItem {
  title: React.ReactNode;
}
const FightListItem: React.FC<React.PropsWithChildren<IFightListItem>> = ({ title, children }) => (
  <ListItem disablePadding>
    <ListItemText primary={title} sx={{ minWidth: 80 }} />
    {children !== undefined && <Box sx={{ width: '100%' }}>{children}</Box>}
  </ListItem>
);

export { FuiFightControl, FightListItem };

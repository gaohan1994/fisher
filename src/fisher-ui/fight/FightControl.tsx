import React from 'react';
import { observer } from 'mobx-react';
import numeral from 'numeral';
import { Box, List, ListItem, ListItemAvatar, ListItemText, Typography, Stack } from '@mui/material';
import { Person } from '@FisherCore';
import { FuiDotAction, FuiLineProgress } from '@Fui';
import { usePersonProgressValue } from './FightHook';

interface IFuiFightControl {
  person: Person;
}
const FuiFightControl: React.FC<IFuiFightControl> = observer(({ person }) => {
  const { hpProgressValue, actionProgressValue } = usePersonProgressValue(person);
  return (
    <List>
      <FightListItem title="生命值" primary={<FuiLineProgress value={hpProgressValue} color="progressHp" />}>
        <Typography>{`${person.Hp}/${person.attributePanel.MaxHp}`}</Typography>
      </FightListItem>
      <FightListItem title="攻速" primary={<FuiLineProgress value={actionProgressValue} color="progress" />}>
        <Typography>{numeral(actionProgressValue).format('0')}%</Typography>
      </FightListItem>
      <FightListItem
        title="状态栏"
        primary={
          person.actionManager.activeDotActions.length > 0 ? (
            <Stack direction="row" style={{ flexWrap: 'wrap' }}>
              {person.actionManager.activeDotActions.map((dotAction) => (
                <FuiDotAction key={dotAction.id} dotAction={dotAction} />
              ))}
            </Stack>
          ) : (
            <Typography>空</Typography>
          )
        }
      />
    </List>
  );
});

interface IFightListItem {
  primary: React.ReactNode;
  title: React.ReactNode;
}
const FightListItem: React.FC<React.PropsWithChildren<IFightListItem>> = ({ primary, title, children }) => (
  <ListItem disablePadding>
    <ListItemAvatar>
      <Typography>{title}</Typography>
    </ListItemAvatar>
    <ListItemText primary={primary} />
    {children !== undefined && <Box sx={{ width: 100, display: 'flex', justifyContent: 'flex-end' }}>{children}</Box>}
  </ListItem>
);

export { FuiFightControl };

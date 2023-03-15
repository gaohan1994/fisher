import React from 'react';
import { observer } from 'mobx-react';
import { Box, List, ListItem, ListItemAvatar, ListItemText, Typography, Stack } from '@mui/material';
import { Person } from '@FisherCore';
import { FuiDotAction, FuiLineProgress } from '@Fui';
import numeral from 'numeral';

interface FuiBattleControlProps {
  person: Person;
}
const FuiBattleControl: React.FC<FuiBattleControlProps> = observer(({ person }) => (
  <List>
    <BattleListItem
      title="生命值"
      primary={<FuiLineProgress value={(person.Hp / person.attributePanel.MaxHp) * 100} color="progressHp" />}
    >
      <Typography>{`${person.Hp}/${person.attributePanel.MaxHp}`}</Typography>
    </BattleListItem>

    <BattleListItem
      title="攻速"
      primary={<FuiLineProgress value={person.actionManager.attackActionTimer.progress} color="progress" />}
    >
      <Typography>{numeral(person.actionManager.attackActionTimer.progress).format('0')}%</Typography>
    </BattleListItem>
    <BattleListItem
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
));

interface ProgressListItemProps {
  primary: React.ReactNode;
  title: React.ReactNode;
}
const BattleListItem: React.FC<React.PropsWithChildren<ProgressListItemProps>> = ({ primary, title, children }) => (
  <ListItem disablePadding>
    <ListItemAvatar>
      <Typography>{title}</Typography>
    </ListItemAvatar>
    <ListItemText primary={primary} />
    {children !== undefined && <Box sx={{ width: 100, display: 'flex', justifyContent: 'flex-end' }}>{children}</Box>}
  </ListItem>
);

export { FuiBattleControl };

import React from 'react';
import { observer } from 'mobx-react';
import { core } from '@FisherCore';
import { FuiBaseDashboard } from '@Fui';
import { Button, Collapse, Grid, Typography, styled } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { BattleEnemySelector } from './BattleEnemySelector';

const ExpandMore = styled((props: any) => {
  const { ...others } = props;
  return <ExpandMoreIcon {...others} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const BattleDashboard = observer(() => {
  const { battle } = core;
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <FuiBaseDashboard
      fisherComponent={battle}
      action={
        <Button
          sx={{ mr: 1 }}
          variant="contained"
          color="warning"
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          {expanded ? '收起副本' : '选择副本'}
          <ExpandMore expand={expanded} />
        </Button>
      }
    >
      <Typography variant="caption" color="secondary" component="div" textAlign="center" sx={{ mb: 1 }}>
        {battle.activeEnemyItem ? `当前战斗目标：${battle.activeEnemyItem.name}` : '当前暂无挑战的目标'}
      </Typography>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <BattleEnemySelector />
      </Collapse>
    </FuiBaseDashboard>
  );
});

export { BattleDashboard };

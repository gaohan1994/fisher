import React from 'react';
import { observer } from 'mobx-react';
import { DungeonItem, core } from '@FisherCore';
import { FuiBaseDashboard, FuiEnemyRewardPreview } from '@Fui';
import { Box, Button, Collapse, Grid, Typography, styled } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { DungeonCard } from './DungeonItem';
import { useDungeonItemRewards } from './DungeonItemHook';

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

const DungeonDashboard = observer(() => {
  const { dungeon } = core;
  const { activeDungeonItem } = dungeon;
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <FuiBaseDashboard
      fisherComponent={dungeon}
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
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="body2">
          {activeDungeonItem ? `当前挑战副本：${activeDungeonItem.name}` : '当前暂无挑战的副本'}
        </Typography>
        {activeDungeonItem && <ActiveDungeonDashboardInfo activeDungeonItem={activeDungeonItem} />}
      </Box>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Grid container spacing={2}>
          {dungeon.packages.map((item) => (
            <Grid key={item.id} item xs={4}>
              <DungeonCard dungeonItem={item} onSelectDungeonItem={handleExpandClick} />
            </Grid>
          ))}
        </Grid>
      </Collapse>
    </FuiBaseDashboard>
  );
});

interface IActiveDungeonDashboardInfo {
  activeDungeonItem: DungeonItem;
}
const ActiveDungeonDashboardInfo: React.FC<IActiveDungeonDashboardInfo> = ({ activeDungeonItem }) => {
  const { rewardItems, extraRewardItems } = useDungeonItemRewards(activeDungeonItem);
  return (
    <React.Fragment>
      <Typography variant="body2" color="secondary">
        副本进度：{activeDungeonItem.progress + 1}/{activeDungeonItem.enemiesNumber}
      </Typography>
      <Typography variant="body2" color="secondary" sx={{ mb: 1 }}>
        战斗目标：{activeDungeonItem.currentEnemyItem.name}
      </Typography>
      <FuiEnemyRewardPreview rewardItems={rewardItems} randomRewardItems={extraRewardItems} />
    </React.Fragment>
  );
};

export { DungeonDashboard };

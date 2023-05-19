import React from 'react';
import { observer } from 'mobx-react';
import { core } from '@FisherCore';
import { FuiBaseDashboard } from '@Fui';
import { Button, Collapse, Grid, Typography, styled } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { DungeonCard } from './DungeonItem';

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
      <Typography variant="caption" color="secondary" component="div" textAlign="center" sx={{ mb: 1 }}>
        {dungeon.activeDungeonItem ? `当前挑战副本：${dungeon.activeDungeonItem.name}` : '当前暂无挑战的副本'}
      </Typography>
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

export { DungeonDashboard };

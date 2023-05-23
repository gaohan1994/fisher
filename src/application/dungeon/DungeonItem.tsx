import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { Avatar, Button, Card, CardActions, CardContent, CardHeader, Typography } from '@mui/material';
import { DungeonItem, core } from '@FisherCore';
import { FuiEnemyRewardPreview } from '@Fui';
import { useDungeonItemRewards, useIsActiveDungeonItem } from './DungeonItemHook';

interface IDungeonCard {
  dungeonItem: DungeonItem;
  onSelectDungeonItem?: (dungeonItem: DungeonItem) => void;
  onClearDungeonItem?: () => void;
}
const DungeonCard: FC<IDungeonCard> = observer(({ dungeonItem, onSelectDungeonItem, onClearDungeonItem }) => {
  const isActiveDungeonItem = useIsActiveDungeonItem(dungeonItem);
  const { rewardItems, extraRewardItems } = useDungeonItemRewards(dungeonItem);

  const onStartDungeonItem = React.useCallback(() => {
    core.dungeon.setActiveDungeonItem(dungeonItem);
    core.dungeon.start();
    onSelectDungeonItem?.(dungeonItem);
  }, []);

  const onStopDungeonItem = React.useCallback(() => {
    core.dungeon.stop();
    core.dungeon.clearActiveDungeonItem();
    onClearDungeonItem?.();
  }, []);

  return (
    <Card>
      <CardHeader
        avatar={<Avatar aria-label="recipe">{dungeonItem.name.charAt(1)}</Avatar>}
        title={dungeonItem.name}
        subheader={dungeonItem.desc}
      />
      <CardContent sx={{ pt: 0, pb: 0 }}>
        {dungeonItem.enemies.map((enemy, index) => (
          <Typography key={`${dungeonItem.id}-${enemy.id}-${index}`} variant="caption" color="text.secondary">
            {`○ ${enemy.name}`}
          </Typography>
        ))}
      </CardContent>

      <CardActions sx={{ justifyContent: 'center' }}>
        {!isActiveDungeonItem ? (
          <Button variant="contained" color="success" onClick={onStartDungeonItem}>
            挑战{dungeonItem.name}
          </Button>
        ) : (
          <Button variant="contained" color="error" onClick={onStopDungeonItem}>
            停止挑战{dungeonItem.name}
          </Button>
        )}
        <FuiEnemyRewardPreview rewardItems={rewardItems} randomRewardItems={extraRewardItems} />
      </CardActions>
    </Card>
  );
});

export { DungeonCard };

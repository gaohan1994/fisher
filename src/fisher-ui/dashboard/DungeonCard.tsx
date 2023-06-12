import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { Avatar, Button, Card, CardActions, CardContent, CardHeader, Typography } from '@mui/material';
import { DungeonItem, core } from '@FisherCore';
import { FuiItemName } from '../item';
import { FuiLevelInfo } from '../experience';
import { FuiEnemyRewardPreview } from '../reward';
import { useDungeonItemRewards, useIsActiveDungeonItem } from './DungeonHook';
import { notifycationStore } from '../notifycation';

interface IDungeonCard {
  dungeonItem: DungeonItem;
  onSelectDungeonItem?: (dungeonItem: DungeonItem) => void;
  onClearDungeonItem?: () => void;
}
const DungeonCard: FC<IDungeonCard> = observer(({ dungeonItem, onSelectDungeonItem, onClearDungeonItem }) => {
  const { master } = core;
  const isActiveDungeonItem = useIsActiveDungeonItem(dungeonItem);
  const { rewards } = useDungeonItemRewards(dungeonItem);

  const onStartDungeonItem = () => {
    try {
      core.dungeon.setActiveDungeonItem(dungeonItem);
      core.dungeon.start();

      onSelectDungeonItem?.(dungeonItem);
    } catch (error: any) {
      notifycationStore.alert('error', error.label);
    }
  };

  const onStopDungeonItem = React.useCallback(() => {
    core.dungeon.stop();
    core.dungeon.clearActiveDungeonItem();
    onClearDungeonItem?.();
  }, []);

  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" src={dungeonItem.media}>
            {/* {dungeonItem.name.charAt(1)} */}
          </Avatar>
        }
        title={<FuiItemName item={dungeonItem} />}
        subheader={
          <Typography variant="caption">
            入场等级需求
            <FuiLevelInfo level={dungeonItem.unlockLevel} sx={{ ml: 1 }} />
          </Typography>
        }
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
          <Button
            variant="contained"
            color="success"
            onClick={onStartDungeonItem}
            disabled={dungeonItem.unlockLevel > master.level}
          >
            挑战{dungeonItem.name}
          </Button>
        ) : (
          <Button variant="contained" color="error" onClick={onStopDungeonItem}>
            停止挑战{dungeonItem.name}
          </Button>
        )}
        <FuiEnemyRewardPreview rewardItems={rewards} />
      </CardActions>
    </Card>
  );
});

export { DungeonCard };

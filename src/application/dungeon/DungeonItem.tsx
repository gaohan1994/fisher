import React, { FC, Fragment } from 'react';
import { observer } from 'mobx-react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  IconButton,
  Popover,
  Tooltip,
  Typography,
} from '@mui/material';
import { Assets, DungeonItem, core } from '@FisherCore';
import { FuiColor, RewardList } from '@Fui';
import { useDungeonItemRewards, useIsActiveDungeonItem } from './DungeonItemHook';

interface IDungeonCard {
  dungeonItem: DungeonItem;
  onSelectDungeonItem?: (dungeonItem: DungeonItem) => void;
  onClearDungeonItem?: () => void;
}
const DungeonCard: FC<IDungeonCard> = observer(({ dungeonItem, onSelectDungeonItem, onClearDungeonItem }) => {
  const isActiveDungeonItem = useIsActiveDungeonItem(dungeonItem);
  const { hasRewardItems, rewardItems, hasExtraRewards, extraRewardItems } = useDungeonItemRewards(dungeonItem);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);

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
    <Fragment>
      <Card>
        <CardHeader
          avatar={<Avatar aria-label="recipe">{dungeonItem.name.charAt(1)}</Avatar>}
          title={dungeonItem.name}
          subheader={dungeonItem.desc}
          action={isActiveDungeonItem && <CircularProgress color="secondary" size={30} />}
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
          <Tooltip title="查看奖励列表">
            <IconButton aria-label="settings" onClick={handleClick}>
              <Avatar src={Assets.ChestNormal} variant="square" />
            </IconButton>
          </Tooltip>
        </CardActions>
      </Card>

      <Popover
        id="reward-popover"
        open={open}
        onClose={handleClose}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Box sx={{ p: 2, bgcolor: FuiColor.common.black }}>
          {hasRewardItems && <RewardList listHeader="Boss奖励" items={rewardItems} />}
          {hasExtraRewards && <RewardList listHeader="通关奖励" items={extraRewardItems} />}
        </Box>
      </Popover>
    </Fragment>
  );
});

export { DungeonCard };

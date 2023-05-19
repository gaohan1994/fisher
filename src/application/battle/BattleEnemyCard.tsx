import React, { FC, Fragment } from 'react';
import { observer } from 'mobx-react';
import {
  Avatar,
  Box,
  Card,
  CardHeader,
  CircularProgress,
  IconButton,
  Popover,
  Tooltip,
  Typography,
} from '@mui/material';
import { Assets, EnemyItem, core } from '@FisherCore';
import { FuiColor, RewardList } from '@Fui';
import { useBattleEnemyItemRewards, useIsActiveBattleEnemyItem } from './BattleHook';

const BattleEnemyActiveTag = () => (
  <Typography variant="caption" color="secondary" sx={{ ml: 1 }}>
    战斗中
    <CircularProgress size={10} color="secondary" sx={{ ml: 1 }} />
  </Typography>
);

interface IBattleEnemyCard {
  enemyItem: EnemyItem;
  onSelectEnemyItem?: (enemyItem: EnemyItem) => void;
}
const BattleEnemyCard: FC<IBattleEnemyCard> = observer(({ enemyItem, onSelectEnemyItem }) => {
  const isActiveBattleEnemyItem = useIsActiveBattleEnemyItem(enemyItem);
  const { hasRewardItems, rewardItems, randomRewardItems, hasRandomRewardItems } = useBattleEnemyItemRewards(enemyItem);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);

  const onStartBattleEnemyItem = React.useCallback(() => {
    core.battle.setAcitveEnemyItem(enemyItem);
    core.battle.start();
    onSelectEnemyItem?.(enemyItem);
  }, []);

  return (
    <Fragment>
      <Card>
        <CardHeader
          title={
            <React.Fragment>
              {enemyItem.name}
              {isActiveBattleEnemyItem && <BattleEnemyActiveTag />}
            </React.Fragment>
          }
          subheader={enemyItem.desc}
          avatar={<Avatar src={enemyItem.media} />}
          action={
            <React.Fragment>
              <Tooltip title="战斗">
                <IconButton onClick={onStartBattleEnemyItem}>
                  <Avatar src={Assets.attack} variant="square" sx={{ width: 30, height: 30 }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="查看奖励列表">
                <IconButton aria-label="settings" onClick={handleClick}>
                  <Avatar src={Assets.ChestNormal} variant="square" />
                </IconButton>
              </Tooltip>
            </React.Fragment>
          }
        />
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
          {hasRewardItems && <RewardList listHeader="普通奖励" items={rewardItems} />}
          {hasRandomRewardItems && <RewardList listHeader="随机奖励" items={randomRewardItems} />}
        </Box>
      </Popover>
    </Fragment>
  );
});

export { BattleEnemyCard };

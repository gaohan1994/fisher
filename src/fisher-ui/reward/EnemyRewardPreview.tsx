import React from 'react';
import { Avatar, Box, IconButton, Popover, Tooltip } from '@mui/material';
import { Assets, Item } from '@FisherCore';
import { RewardList } from './RewardList';
import { FuiColor } from '../theme';

interface IFuiEnemyRewardPreview {
  rewardItems?: Item[];
  randomRewardItems?: Item[];
}
const FuiEnemyRewardPreview: React.FC<IFuiEnemyRewardPreview> = ({ rewardItems, randomRewardItems }) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);

  return (
    <React.Fragment>
      <Tooltip title="查看奖励列表">
        <IconButton aria-label="settings" onClick={handleClick}>
          <Avatar src={Assets.ChestNormal} variant="square" />
        </IconButton>
      </Tooltip>
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
          {rewardItems && rewardItems.length > 0 && <RewardList listHeader="奖励列表" items={rewardItems} />}
          {randomRewardItems && randomRewardItems.length > 0 && (
            <RewardList listHeader="随机奖励列表" items={randomRewardItems} />
          )}
        </Box>
      </Popover>
    </React.Fragment>
  );
};

export { FuiEnemyRewardPreview };

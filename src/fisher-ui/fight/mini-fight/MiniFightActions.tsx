import { FC } from 'react';
import { observer } from 'mobx-react';
import RunCircleIcon from '@mui/icons-material/RunCircle';
import { Avatar, IconButton, Tooltip } from '@mui/material';
import { Assets, core } from '@FisherCore';

const avatarSx = {
  sx: {
    width: 30,
    height: 30,
  },
};

interface IMiniFightAction {
  onClick: () => void;
}
const FuiMiniRetreatButton: FC<IMiniFightAction> = ({ onClick }) => (
  <Tooltip title="撤退">
    <IconButton onClick={onClick} size="large">
      <RunCircleIcon />
    </IconButton>
  </Tooltip>
);

const FuiMiniExecuteRewardButton: FC<IMiniFightAction> = ({ onClick }) => (
  <Tooltip title="拾取战利品">
    <IconButton onClick={onClick}>
      <Avatar src={Assets.ChestNormal} {...avatarSx} />
    </IconButton>
  </Tooltip>
);

const FuiMiniMasterHealPotionButton: FC = observer(() => {
  const { master } = core;

  if (!master.healPotionHandler.hasPotion) {
    return (
      <Tooltip title="暂未装备药水">
        <IconButton size="large">
          <Avatar src={Assets.LowHealPotion} {...avatarSx} />
        </IconButton>
      </Tooltip>
    );
  }

  const { healPotionHandler } = master;

  const onClick = () => {
    healPotionHandler.usePotion(master.person);
  };

  return (
    <Tooltip title={`使用${healPotionHandler.potion!.item.name}`}>
      <IconButton onClick={onClick}>
        <Avatar src={healPotionHandler.potion!.item.media} {...avatarSx} />
      </IconButton>
    </Tooltip>
  );
});

export { FuiMiniRetreatButton, FuiMiniExecuteRewardButton, FuiMiniMasterHealPotionButton };

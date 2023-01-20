import React from 'react';
import { observer } from 'mobx-react';
import {
  Avatar,
  AvatarGroup,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Popover,
  Stack,
  Typography,
} from '@mui/material';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import StarIcon from '@mui/icons-material/Star';
import { core, Recipe } from '@FisherCore';
import { FuiColor, FuiIconText, FuiLineProgress, FuiRecipeRewardAvatars, FuiRecipeRewardDetail } from '@Components';
import { useRecipe } from '../hook';

interface Props {
  recipe: Recipe;
}

const FuiMiningRecipe: React.FC<Props> = observer(({ recipe }) => {
  const { intervalSecond, rewardItemAvatars } = useRecipe(recipe);
  const { activeRecipe, skill, start, stop } = core.mining;

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);

  const isActive = React.useMemo(() => activeRecipe?.id === recipe.id, [activeRecipe, recipe]);
  return (
    <Card sx={{ bgcolor: FuiColor.card.background }}>
      <CardActionArea onClick={handleClick}>
        <CardHeader
          title={recipe.name}
          sx={{ pb: 0 }}
          subheader={
            isActive && (
              <Typography variant="caption" color="secondary">
                正在采集
              </Typography>
            )
          }
          avatar={
            <AvatarGroup>
              {rewardItemAvatars.map((avatar, index) => (
                <Avatar key={index} src={avatar} />
              ))}
            </AvatarGroup>
          }
        />
        <CardContent>
          <FuiIconText icon={<AccessAlarmIcon />} text={`采集间隔 ${intervalSecond} 秒`} />
          <FuiIconText icon={<EmojiEventsIcon />} text={`经验奖励 ${recipe.rewardExperience} 点`} />
          <FuiIconText icon={<StarIcon />} text="奖励列表：" />
          <FuiRecipeRewardAvatars recipe={recipe} />
        </CardContent>
      </CardActionArea>
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
        <FuiRecipeRewardDetail recipe={recipe} />
      </Popover>
      <CardContent>
        <Stack spacing={2}>
          {isActive ? <FuiLineProgress value={skill.progress} /> : <FuiLineProgress value={0} />}
          {isActive ? (
            <Button variant="contained" sx={{ width: '100%' }} onClick={stop} color="secondary">
              停止{recipe.name}
            </Button>
          ) : (
            <Button variant="contained" sx={{ width: '100%' }} onClick={() => start(recipe)}>
              开始{recipe.name}
            </Button>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
});

export { FuiMiningRecipe };

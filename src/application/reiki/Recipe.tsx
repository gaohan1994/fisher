import React from 'react';
import { observer } from 'mobx-react';
import {
  Avatar,
  AvatarGroup,
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
import { FuiColor, FuiIconText, FuiProgressButton, FuiRecipeRewardAvatars, FuiRecipeRewardDetail } from '@Fui';
import { useRecipe } from '../hook';

interface Props {
  recipe: Recipe;
}

const FuiReikiRecipe: React.FC<Props> = observer(({ recipe }) => {
  const { intervalSecond, rewardItemAvatars } = useRecipe(recipe);
  const { activeRecipe, skill, start, stop } = core.reiki;

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);

  const isActive = React.useMemo(() => activeRecipe?.id === recipe.id, [activeRecipe, recipe]);
  const onButtonClick = React.useCallback(() => {
    if (isActive) {
      return stop();
    }
    start(recipe);
  }, [isActive, recipe]);
  return (
    <Card sx={{ bgcolor: FuiColor.primary.background }}>
      <CardActionArea onClick={handleClick}>
        <CardHeader
          title={recipe.name}
          sx={{ pb: 0 }}
          avatar={
            <AvatarGroup>
              {rewardItemAvatars.map((avatar, index) => (
                <Avatar key={index} src={avatar} />
              ))}
            </AvatarGroup>
          }
        />
        <CardContent>
          <FuiIconText icon={<AccessAlarmIcon />} text={`每打坐 ${intervalSecond} 秒获得一次灵气`} />
          <FuiIconText icon={<EmojiEventsIcon />} text={`经验奖励 ${recipe.rewardExperience} 点`} />
          <FuiIconText icon={<StarIcon />} text="奖励列表：" />
          <FuiRecipeRewardAvatars recipe={recipe} />
        </CardContent>
      </CardActionArea>
      <CardContent>
        <Stack direction="row" spacing={2}>
          <FuiProgressButton value={skill.progress} isActive={isActive} onClick={onButtonClick} />
          {isActive && (
            <Typography variant="caption" color="secondary">
              正在{recipe.name}打坐
            </Typography>
          )}
        </Stack>
      </CardContent>
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
    </Card>
  );
});

export { FuiReikiRecipe };

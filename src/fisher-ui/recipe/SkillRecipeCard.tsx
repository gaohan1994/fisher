import React, { PropsWithChildren } from 'react';
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
} from '@mui/material';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import StarIcon from '@mui/icons-material/Star';
import { Recipe } from '@FisherCore';
import { FuiActiveText, FuiColor, FuiIconText, FuiRecipeRewardAvatars, FuiRecipeRewardDetail } from '@Fui';
import { useRecipe, useRecipeIsLevelLocked } from './RecipeHook';

interface Props {
  skillLevel: number;
  isActive: boolean;
  recipe: Recipe;
  onStart: (recipe: Recipe) => void;
  onStop: () => void;
  startButtonLabel?: React.ReactNode;
  stopButtonLabel?: React.ReactNode;
  activeLabel?: React.ReactNode;
}

const FuiSkillRecipeCard: React.FC<PropsWithChildren<Props>> = ({
  isActive,
  skillLevel,
  recipe,
  onStart,
  onStop,
  startButtonLabel,
  stopButtonLabel,
  activeLabel,
  children,
}) => {
  const isLocked = useRecipeIsLevelLocked(skillLevel, recipe);
  const { intervalSecond, rewardItemAvatars } = useRecipe(recipe);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);

  if (isLocked) {
    return <FuiSkillRecipeLockedBackdrop recipe={recipe} />;
  }

  return (
    <Card sx={{ bgcolor: FuiColor.primary.background }}>
      <CardActionArea onClick={handleClick}>
        <CardHeader
          title={recipe.name}
          sx={{ pb: 0 }}
          subheader={isActive && <FuiActiveText text={activeLabel} />}
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
      <CardContent>
        <Stack spacing={2}>
          {children}
          {isActive ? (
            <Button variant="contained" sx={{ width: '100%' }} color="error" onClick={onStop}>
              {stopButtonLabel ?? `停止${recipe.name}`}
            </Button>
          ) : (
            <Button variant="contained" color="info" sx={{ width: '100%' }} onClick={() => onStart(recipe)}>
              {startButtonLabel ?? `开始${recipe.name}`}
            </Button>
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
};

interface IFuiSkillRecipeLockedBackdrop {
  recipe: Recipe;
}
const FuiSkillRecipeLockedBackdrop: React.FC<IFuiSkillRecipeLockedBackdrop> = ({ recipe }) => (
  <Card sx={{ height: '100%' }}>
    <CardHeader
      title={recipe.name}
      subheader={`${recipe.unlockLevel}级解锁`}
      sx={{ pb: 0 }}
      avatar={
        <AvatarGroup>
          <QuestionMarkIcon />
        </AvatarGroup>
      }
    />
    <CardContent>
      <FuiIconText icon={<AccessAlarmIcon />} text={`采集间隔 ？秒`} />
      <FuiIconText icon={<EmojiEventsIcon />} text={`经验奖励 ？点`} />
    </CardContent>
  </Card>
);

export { FuiSkillRecipeCard };

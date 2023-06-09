import React from 'react';
import { observer } from 'mobx-react';
import { Avatar, AvatarGroup, Card, CardActionArea, CardContent, CardHeader, Stack, styled } from '@mui/material';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { Recipe } from '@FisherCore';
import { FuiColor, FuiIconText, FuiItemName } from '@Fui';
import { useRecipe, useRecipeInterval } from './RecipeHook';
import { FuiLevelInfo } from '../experience';

const NoBorderAvatar = styled(Avatar)(() => ({
  '&.MuiAvatar-root': {
    border: 'none',
  },
}));

interface Props {
  recipe: Recipe;
  label: React.ReactNode;
  highLine?: boolean;
  subheader?: React.ReactNode;
  onRecipeClick: (recipe: Recipe) => void;
}
const FuiRecipeCard: React.FC<Props> = observer(({ recipe, label, highLine, subheader, onRecipeClick }) => {
  const { rewardItemAvatars } = useRecipe(recipe);
  const { intervalSecond } = useRecipeInterval(recipe);

  const subheaderComponent = (
    <React.Fragment>
      <FuiLevelInfo level={recipe.unlockLevel} prefixNode={`${label}技能等级需求 Lv:`} />
      {subheader}
    </React.Fragment>
  );

  const headerAvatars = (
    <AvatarGroup className="RecipeCardAvatars">
      {rewardItemAvatars.map((avatar, index) => (
        <NoBorderAvatar key={index} src={avatar} variant="square" />
      ))}
    </AvatarGroup>
  );

  const recipeCardContent = (
    <Stack direction="row" justifyContent="space-between">
      <FuiIconText icon={<AccessAlarmIcon />} text={`${label}时间 ${intervalSecond} 秒`} />
      <FuiIconText icon={<EmojiEventsIcon />} text={`经验奖励 ${recipe.rewardExperience} 点`} />
    </Stack>
  );

  return (
    <Card
      onClick={() => onRecipeClick(recipe)}
      sx={{
        border: 1,
        bgcolor: FuiColor.primary.background,
        borderColor: highLine ? FuiColor.gold : FuiColor.common.black,
      }}
    >
      <CardActionArea>
        <CardHeader
          sx={{ pb: 0 }}
          title={<FuiItemName item={recipe} />}
          subheader={subheaderComponent}
          avatar={headerAvatars}
        />
        <CardContent>{recipeCardContent}</CardContent>
      </CardActionArea>
    </Card>
  );
});

export { FuiRecipeCard };

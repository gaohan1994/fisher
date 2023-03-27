import React from 'react';
import { observer } from 'mobx-react';
import { Avatar, AvatarGroup, Card, CardActionArea, CardContent, CardHeader, Stack, styled } from '@mui/material';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { Recipe } from '@FisherCore';
import { FuiColor, FuiIconText } from '@Fui';
import { useRecipe } from '../../application/hook';

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
  const { intervalSecond, rewardItemAvatars } = useRecipe(recipe);
  return (
    <Card
      onClick={() => onRecipeClick(recipe)}
      sx={{
        bgcolor: FuiColor.primary.background,
        border: 1,
        borderColor: highLine ? FuiColor.gold : FuiColor.common.black,
      }}
    >
      <CardActionArea>
        <CardHeader
          sx={{ pb: 0 }}
          title={recipe.name}
          subheader={subheader}
          avatar={
            <AvatarGroup className="RecipeCardAvatars">
              {rewardItemAvatars.map((avatar, index) => (
                <NoBorderAvatar key={index} src={avatar} variant="square" />
              ))}
            </AvatarGroup>
          }
        />
        <CardContent>
          <Stack direction="row" justifyContent="space-between">
            <FuiIconText icon={<AccessAlarmIcon />} text={`${label}时间 ${intervalSecond} 秒`} />
            <FuiIconText icon={<EmojiEventsIcon />} text={`经验奖励 ${recipe.rewardExperience} 点`} />
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
});

export { FuiRecipeCard };

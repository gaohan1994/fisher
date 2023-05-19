import React from 'react';
import { Avatar, AvatarGroup, Badge, Box } from '@mui/material';
import { Recipe } from '@FisherCore';
import { useRecipe } from '../../application/hook';
import { FuiColor } from '../theme';
import { RewardList } from '../reward';

interface Props {
  recipe: Recipe;
}
const FuiRecipeRewardAvatars: React.FC<Props> = ({ recipe }) => {
  const { rewardItems, randomRewardItems } = useRecipe(recipe);
  return (
    <AvatarGroup sx={{ mt: 1 }} max={6}>
      {[...rewardItems, ...randomRewardItems].map(([recipeItem, item]) => (
        <Badge key={item.id} badgeContent={recipeItem.itemQuantity} color="primary">
          <Avatar src={item.media} />
        </Badge>
      ))}
    </AvatarGroup>
  );
};

const FuiRecipeRewardDetail: React.FC<Props> = ({ recipe }) => {
  const { rewardItems, randomRewardItems } = useRecipe(recipe);
  return (
    <Box sx={{ p: 2, bgcolor: FuiColor.common.black }}>
      <RewardList listHeader="奖励" items={rewardItems.map(([_, item]) => item)} />
      {randomRewardItems && <RewardList listHeader="随机奖励" items={randomRewardItems.map(([_, item]) => item)} />}
    </Box>
  );
};

export { FuiRecipeRewardAvatars, FuiRecipeRewardDetail };

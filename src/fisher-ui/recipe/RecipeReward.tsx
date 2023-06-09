import React from 'react';
import { Avatar, AvatarGroup, Badge, Box } from '@mui/material';
import { Recipe } from '@FisherCore';
import { FuiColor } from '../theme';
import { RewardList } from '../reward';
import { useRecipe } from './RecipeHook';

interface Props {
  recipe: Recipe;
}
const FuiRecipeRewardAvatars: React.FC<Props> = ({ recipe }) => {
  const { rewardItems, randomRewardItems } = useRecipe(recipe);
  return (
    <AvatarGroup sx={{ mt: 1 }} max={6}>
      {rewardItems.map(([recipeItem, item]) => (
        <Badge key={`Normal-${item.id}`} badgeContent={recipeItem.itemQuantity} color="primary">
          <Avatar src={item.media} />
        </Badge>
      ))}
      {randomRewardItems.map(([recipeItem, item]) => (
        <Badge key={`Random-${item.id}`} badgeContent={recipeItem.itemQuantity} color="primary">
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
      <RewardList
        listHeader="奖励"
        items={rewardItems.map(([_, item]) => item)}
        renderKey={(item) => `Normal-${recipe.id}-${item.id}`}
      />
      {randomRewardItems && (
        <RewardList
          listHeader="随机奖励"
          items={randomRewardItems.map(([_, item]) => item)}
          renderKey={(item) => `Random-${recipe.id}-${item.id}`}
        />
      )}
    </Box>
  );
};

export { FuiRecipeRewardAvatars, FuiRecipeRewardDetail };

import React from 'react';
import { Avatar, AvatarGroup, Box, Stack, Typography } from '@mui/material';
import { IRecipeItem, IRecipeRandomRewardItem, NormalItem, Recipe } from '@FisherCore';
import { useRecipe } from '../../application/hook';
import { FuiItem } from '../item';
import { FuiColor } from '../theme';

interface Props {
  recipe: Recipe;
}
const FuiRecipeRewardAvatars: React.FC<Props> = ({ recipe }) => {
  const { rewardItemAvatars, randomRewardItemAvatars } = useRecipe(recipe);
  return (
    <AvatarGroup sx={{ mt: 1 }} max={6}>
      {[...rewardItemAvatars, ...randomRewardItemAvatars].map((avatar, index) => (
        <Avatar key={index} src={avatar} />
      ))}
    </AvatarGroup>
  );
};

interface FuiRecipeRewardItemProps {
  recipeItem: IRecipeItem | IRecipeRandomRewardItem;
  item: NormalItem;
}
const FuiRecipeRewardItem: React.FC<FuiRecipeRewardItemProps> = ({ item, recipeItem }) => {
  return (
    <Stack direction="row" spacing={2}>
      <FuiItem item={item} />
      <Stack>
        <Typography variant="caption">
          {(recipeItem as IRecipeRandomRewardItem)?.probability !== undefined &&
            `${(recipeItem as IRecipeRandomRewardItem)?.probability}%概率额外获得奖励 `}
          {item.name} x {recipeItem.itemQuantity}
        </Typography>
      </Stack>
    </Stack>
  );
};

const FuiRecipeRewardDetail: React.FC<Props> = ({ recipe }) => {
  const { rewardItems, randomRewardItems } = useRecipe(recipe);
  return (
    <Box sx={{ p: 2, bgcolor: FuiColor.common.black }}>
      <Typography variant="body2">奖励</Typography>
      {rewardItems.map(([recipeItem, item]) => (
        <FuiRecipeRewardItem key={item.id} item={item} recipeItem={recipeItem} />
      ))}
      {recipe.hasRandomRewardItems && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2">随机奖励</Typography>
          {randomRewardItems.map(([recipeItem, item]) => (
            <FuiRecipeRewardItem key={item.id} item={item} recipeItem={recipeItem} />
          ))}
        </Box>
      )}
    </Box>
  );
};

export { FuiRecipeRewardAvatars, FuiRecipeRewardDetail };

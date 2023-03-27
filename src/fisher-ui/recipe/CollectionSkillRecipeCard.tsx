import React from 'react';
import { observer } from 'mobx-react';
import { Typography } from '@mui/material';
import { Cook, Forge, Recipe } from '@FisherCore';
import { FuiRecipeCard } from '@Fui';

interface Props {
  recipe: Recipe;
  coreComponent: Forge | Cook;
}
const FuiCollectionSkillRecipeCard: React.FC<Props> = observer(({ recipe, coreComponent }) => {
  const isCurrentRecipeActive = recipe.id === coreComponent.activeRecipe?.id;

  const onRecipeClick = () => {
    if (coreComponent.isActive) {
      coreComponent.stop();
    }

    coreComponent.setActiveRecipe(recipe);
  };

  return (
    <FuiRecipeCard
      recipe={recipe}
      label={coreComponent.name}
      highLine={isCurrentRecipeActive}
      onRecipeClick={onRecipeClick}
      subheader={
        isCurrentRecipeActive &&
        coreComponent.isActive && (
          <Typography variant="caption" color="secondary">
            正在{coreComponent.name}
          </Typography>
        )
      }
    />
  );
});

export { FuiCollectionSkillRecipeCard };

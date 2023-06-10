import { FC, useMemo } from 'react';
import { observer } from 'mobx-react';
import { Cook, Forge, Mining, Recipe, Reiki, core } from '@FisherCore';
import { FuiSkillRecipeCard } from './SkillRecipeCard';
import { FuiLineProgress } from '../progress';
import { FuiRecipeCard } from './RecipeCard';
import { FuiActiveText } from '../text';

type IMiningRecipeCard = Pick<IRenderRecipeCard, 'recipe'>;
const MiningRecipeCard: FC<IMiningRecipeCard> = observer(({ recipe }) => (
  <RenderRecipeCard coreComponent={core.mining} recipe={recipe} />
));

type IReikiRecipeCard = Pick<IRenderRecipeCard, 'recipe'>;
const ReikiRecipeCard: FC<IReikiRecipeCard> = observer(({ recipe }) => (
  <RenderRecipeCard coreComponent={core.reiki} recipe={recipe} />
));

type IForgeRecipeCard = Pick<IRenderBuildSkillCard, 'recipe'>;
const ForgeRecipeCard: FC<IForgeRecipeCard> = observer(({ recipe }) => (
  <RenderBuildSkillCard coreComponent={core.forge} recipe={recipe} />
));

type ICookRecipeCard = Pick<IRenderBuildSkillCard, 'recipe'>;
const CookRecipeCard: FC<ICookRecipeCard> = observer(({ recipe }) => (
  <RenderBuildSkillCard coreComponent={core.cook} recipe={recipe} />
));

interface IRenderRecipeCard {
  coreComponent: Mining | Reiki;
  recipe: Recipe;
}
const RenderRecipeCard: FC<IRenderRecipeCard> = observer(({ coreComponent, recipe }) => {
  const isActive = Boolean(coreComponent.activeRecipe?.id === recipe.id);
  return (
    <FuiSkillRecipeCard
      recipe={recipe}
      isActive={isActive}
      skillLevel={coreComponent.level}
      activeLabel="正在采集"
      onStop={coreComponent.stop}
      onStart={() => coreComponent.start(recipe)}
    >
      <FuiLineProgress value={isActive ? coreComponent.skill.progress : 0} />
    </FuiSkillRecipeCard>
  );
});

interface IRenderBuildSkillCard {
  coreComponent: Forge | Cook;
  recipe: Recipe;
}
const RenderBuildSkillCard: FC<IRenderBuildSkillCard> = observer(({ coreComponent, recipe }) => {
  const isActive = useMemo(
    () => Boolean(coreComponent.activeRecipe?.id === recipe.id),
    [coreComponent.activeRecipe, recipe.id]
  );

  const onRecipeClick = () => {
    if (coreComponent.isActive) {
      return coreComponent.stop();
    }

    coreComponent.setActiveRecipe(recipe);
  };

  return (
    <FuiRecipeCard
      recipe={recipe}
      label={coreComponent.name}
      highLine={isActive}
      onRecipeClick={onRecipeClick}
      subheader={isActive && coreComponent.isActive && <FuiActiveText text={`正在${coreComponent.name}`} />}
    />
  );
});

export { MiningRecipeCard, ReikiRecipeCard, ForgeRecipeCard, CookRecipeCard };

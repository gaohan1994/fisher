import { FC } from 'react';
import { observer } from 'mobx-react';
import { Avatar, AvatarGroup, CardHeader } from '@mui/material';
import { Mining, Recipe, Reiki } from '@FisherCore';

import { TimerProgess } from '../../progress';
import { ActiveText, ModuleCard } from '../../layout';
import { ExperienceText, IntervalText, RewardsText, RecipeButton, useRecipeDisplayInterval } from '../common';
import { useRecipeIcons } from './Hooks';

const ActiveTextLabel = '正在进行中';
const IntervalPrefix = '采集间隔：';
const ExperiencePrefix = '经验奖励：';
const RewardsPrefix = '物品奖励列表：';
const StartButtonPrefix = '开始';
const StopButtonPrefix = '停止';

export interface RecipeCardProps {
  component: Mining | Reiki;
  recipe: Recipe;
}
export const RecipeCard: FC<RecipeCardProps> = observer(({ component, recipe }) => {
  const {
    start,
    stop,
    activeRecipe,
    skill: { timer },
  } = component;
  const { rewardExperience } = recipe;

  const icons = useRecipeIcons(recipe);
  const displayInterval = useRecipeDisplayInterval(recipe);

  const recipeAvatar = icons[0];
  const isActive = Boolean(activeRecipe !== undefined && activeRecipe === recipe);

  return (
    <ModuleCard
      header={
        <CardHeader
          title={recipe.name}
          avatar={<Avatar src={recipeAvatar} />}
          subheader={isActive && <ActiveText>{ActiveTextLabel}</ActiveText>}
        />
      }
    >
      <IntervalText>
        {IntervalPrefix}
        {displayInterval}
      </IntervalText>
      <ExperienceText>
        {ExperiencePrefix}
        {rewardExperience}
      </ExperienceText>
      <RewardsText>{RewardsPrefix}</RewardsText>
      <AvatarGroup>
        {icons.map((item) => (
          <Avatar key={`${recipe.id}-${item}`} src={item} />
        ))}
      </AvatarGroup>
      <TimerProgess timer={timer} />
      {isActive ? (
        <RecipeButton color="error" onClick={stop}>
          {StopButtonPrefix}
          {recipe.name}
        </RecipeButton>
      ) : (
        <RecipeButton color="info" onClick={() => start(recipe)}>
          {StartButtonPrefix}
          {recipe.name}
        </RecipeButton>
      )}
    </ModuleCard>
  );
});

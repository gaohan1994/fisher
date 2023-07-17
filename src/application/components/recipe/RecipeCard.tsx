import { FC, useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react';
import { Avatar, AvatarGroup, CardHeader } from '@mui/material';
import { Mining, Recipe, Reiki } from '@FisherCore';

import { ActiveText, ModuleCard } from '../layout';
import { Progress } from '../progress';
import { RecipeButton } from './Styled';
import { useRecipeDisplayInterval, useRecipeIcons } from './Hooks';
import { ExperienceText, IntervalText, RewardsText } from './Common';

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
  const { start, stop, activeRecipe } = component;
  const { rewardExperience } = recipe;

  const [progress, setProgress] = useState(0);
  const animateRef = useRef<number>(-1);

  const icons = useRecipeIcons(recipe);
  const displayInterval = useRecipeDisplayInterval(recipe);

  const recipeAvatar = icons[0];
  const isActive = Boolean(activeRecipe !== undefined && activeRecipe === recipe);

  useEffect(() => {
    const animateProgressFrame = () => {
      setProgress(component.skill.progress);
      animateRef.current = requestAnimationFrame(animateProgressFrame);
    };

    if (isActive) {
      animateRef.current = requestAnimationFrame(animateProgressFrame);
    } else {
      cancelAnimationFrame(animateRef.current);
    }

    return () => {
      cancelAnimationFrame(animateRef.current);
      animateRef.current = -1;
    };
  }, [isActive]);

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
      {isActive ? <Progress value={progress} /> : <Progress value={0} />}
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

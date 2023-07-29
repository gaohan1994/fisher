import { FC } from 'react';
import { observer } from 'mobx-react';
import { Divider, Stack } from '@mui/material';
import { notifycationStore } from '@Fui';
import { Cook, Forge, Recipe, RecipeHandler } from '@FisherCore';

import { TimerProgess } from '../../progress';
import { StackSpaceBetween } from '../../layout';
import { FuiLevelText } from '../../level';
import {
  useRecipeCostItems,
  useRecipeDisplayInterval,
  useRecipeRewardItems,
  useRecipeRewardRandomItems,
  ForgeIntervalText,
  ForgeExperienceText,
} from '../common';

import { useUnavaiableReason } from './Hook';
import { StationButton, StationContainer } from './Styled';
import { Rewards } from './Rewards';
import { Costs } from './Costs';

const SkillLevelText = '当前技能等级：';
const SkillLevelRequireText = '技能等级需求：';
const StationTitle = '工作台';
const RewardTitle = '制作奖励';
const RandomRewardTitle = '上级作物奖励';
const StationButtonText = '开始制作';

export interface StationProps {
  component: Forge | Cook;
}
export const Station: FC<StationProps> = observer(
  ({
    component: {
      skill: {
        timer,
        recipeHandler,
        experience: { level },
      },
      isActive,
      start,
      stop,
    },
  }) => {
    const { activeRecipe, costControlMap } = recipeHandler as RecipeHandler & { activeRecipe: Recipe };
    const { rewardExperience, hasRandomRewardItems, unlockLevel } = activeRecipe;

    const displayInterval = useRecipeDisplayInterval(activeRecipe);
    const reason = useUnavaiableReason(recipeHandler);
    const costItems = useRecipeCostItems(activeRecipe);
    const rewardItems = useRecipeRewardItems(activeRecipe);
    const randomRewardItems = useRecipeRewardRandomItems(activeRecipe);

    const onRecipeButtonClick = () => {
      if (Boolean(reason)) {
        return notifycationStore.alert('error', reason);
      }

      try {
        if (isActive) {
          stop();
        } else {
          start();
        }
      } catch (error: any) {
        notifycationStore.alert('error', error.label);
      }
    };

    return (
      <StationContainer title={StationTitle}>
        <StackSpaceBetween>
          <FuiLevelText preText={SkillLevelRequireText} level={unlockLevel} />
          <FuiLevelText preText={SkillLevelText} level={level} />
        </StackSpaceBetween>
        <StackSpaceBetween>
          <ForgeIntervalText>{displayInterval}</ForgeIntervalText>
          <ForgeExperienceText>{rewardExperience}</ForgeExperienceText>
        </StackSpaceBetween>
        <Stack spacing={1} divider={<Divider />}>
          <Rewards id="reward-items" header={RewardTitle} items={rewardItems} />
          {hasRandomRewardItems && (
            <Rewards id="random-reward-items" header={RandomRewardTitle} items={randomRewardItems} />
          )}
          <Costs control={costControlMap} items={costItems} />
          <TimerProgess timer={timer} />
          <StationButton reason={reason} onClick={onRecipeButtonClick}>
            {Boolean(reason) ? reason : StationButtonText}
          </StationButton>
        </Stack>
      </StationContainer>
    );
  }
);

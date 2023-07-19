import { FC } from 'react';
import { Avatar, AvatarGroup, CardHeader } from '@mui/material';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import { Recipe } from '@FisherCore';

import { ModuleCard } from '../../layout';
import { Progress } from '../../progress';
import { RecipeButton, ExperienceText, IntervalText, RewardsText } from '../common';

const UnLockLevelSuffix = '级解锁';
const LockIntervalText = '采集间隔：？秒';
const LockExperienceText = '经验奖励：？点';
const LockRewardText = '物品奖励列表：？';

const questionMarkAvatar = (
  <Avatar>
    <QuestionMarkIcon />
  </Avatar>
);

interface LockRecipeCardProps {
  recipe: Recipe;
}
export const LockRecipeCard: FC<LockRecipeCardProps> = ({ recipe: { name, unlockLevel } }) => (
  <ModuleCard
    backgroundColor="theme.paper.background"
    header={<CardHeader title={name} subheader={`${unlockLevel}${UnLockLevelSuffix}`} avatar={questionMarkAvatar} />}
  >
    <IntervalText>{LockIntervalText}</IntervalText>
    <ExperienceText>{LockExperienceText}</ExperienceText>
    <RewardsText>{LockRewardText}</RewardsText>
    <AvatarGroup>{questionMarkAvatar}</AvatarGroup>
    <Progress value={0} />
    <RecipeButton disabled>{name}</RecipeButton>
  </ModuleCard>
);

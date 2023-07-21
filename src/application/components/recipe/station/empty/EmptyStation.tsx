import { FC } from 'react';
import { Typography } from '@mui/material';

import { ModuleStickyCard } from '../../../layout';
import { Progress } from '../../../progress';
import { RecipeButton } from '../../common';

const EmptyStationTitle = '制作台（空）';
const EmptyActiveRecipeText = '请先选择锻造图纸';
const EmptyStationTooltip = '请先选择制作图纸';

export const EmptyStation: FC = () => (
  <ModuleStickyCard title={EmptyStationTitle}>
    <Typography>{EmptyActiveRecipeText}</Typography>
    <Progress value={0} />
    <RecipeButton color="error">{EmptyStationTooltip}</RecipeButton>
  </ModuleStickyCard>
);

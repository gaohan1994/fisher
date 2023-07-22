import { FC, memo } from 'react';
import { Recipe } from '@FisherCore';
import { CardActionArea, CardContent, CardHeader } from '@mui/material';

import { FuiItemName } from '../../item';
import { FuiLevelText } from '../../level';
import { StackSpaceBetween } from '../../layout';
import { ForgeExperienceText, ForgeIntervalText, useRecipeDisplayInterval } from '../common';
import { ActiveAreaCard, NoBorderAvatar } from './Styled';
import { useRecipeAvatar } from './Hook';

const PreviewUnlockLevelPrefix = '技能等级需求：';

interface PreviewProps {
  recipe: Recipe;
  active?: boolean;
  onClick?: () => void;
}
/**
 * This is build skill recipe preview card.
 *
 * - recipe preview icon [first reward item icon]
 * - recipe name
 * - recipe unlock level
 * - recipe interval
 * - recipe experience reward
 *
 * @returns
 */
export const Preview: FC<PreviewProps> = memo(({ active = false, recipe, onClick }) => {
  const { unlockLevel, rewardExperience } = recipe;
  const avatar = useRecipeAvatar(recipe);
  const displayInterval = useRecipeDisplayInterval(recipe);
  return (
    <ActiveAreaCard active={active} onClick={onClick}>
      <CardActionArea>
        <CardHeader
          avatar={<NoBorderAvatar src={avatar} variant="square" />}
          title={<FuiItemName variant="body2" item={recipe} />}
          subheader={<FuiLevelText level={unlockLevel} preText={PreviewUnlockLevelPrefix} />}
        />
        <CardContent>
          <StackSpaceBetween>
            <ForgeIntervalText>{displayInterval}</ForgeIntervalText>
            <ForgeExperienceText>{rewardExperience}</ForgeExperienceText>
          </StackSpaceBetween>
        </CardContent>
      </CardActionArea>
    </ActiveAreaCard>
  );
});

import { FC } from 'react';
import { Experience } from '@FisherCore';
import { ColorLevelText } from './Styled';
import { useLevelLabel } from './Hook';
import { Chip } from '@mui/material';

interface FuiLevelProps {
  experience: Experience;
}
export const FuiLevel: FC<FuiLevelProps> = ({ experience }) => {
  const label = useLevelLabel(experience);
  return <Chip label={<ColorLevelText id="fui-level" level={experience.level}>{`等级：${label}`}</ColorLevelText>} />;
};

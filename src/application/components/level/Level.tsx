import { FC, PropsWithChildren, ReactNode } from 'react';
import { Chip, TypographyProps } from '@mui/material';
import { Experience } from '@FisherCore';

import { ColorLevelText } from './Styled';
import { useLevelLabel } from './Hook';

interface FuiLevelProps {
  experience: Experience;
}
export const FuiLevel: FC<FuiLevelProps> = ({ experience }) => {
  const label = useLevelLabel(experience);
  return <Chip label={<ColorLevelText id="fui-level" level={experience.level}>{`等级：${label}`}</ColorLevelText>} />;
};

const LevelTextPrefix = 'Lv:';
interface FuiLevelTextProps extends TypographyProps {
  level: number;
  preText?: ReactNode;
}
export const FuiLevelText: FC<PropsWithChildren<FuiLevelTextProps>> = ({ preText, level, children, ...rest }) => (
  <ColorLevelText id="fui-level" level={level} sx={{ display: 'block' }} {...rest}>
    {preText}
    {LevelTextPrefix}
    {level}
    {children}
  </ColorLevelText>
);

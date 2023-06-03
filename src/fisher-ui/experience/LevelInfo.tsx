import { FC, ReactNode } from 'react';
import { Experience } from '@FisherCore';
import { Chip, ChipProps, Typography, TypographyProps } from '@mui/material';
import { useLevelColor } from './LevelHook';

interface IFuiLevelInfo extends TypographyProps {
  level: number;
  prefixNode?: ReactNode;
}
const FuiLevelInfo: FC<IFuiLevelInfo> = ({ prefixNode = 'Lv:', level, ...rest }) => {
  const { color } = useLevelColor(level);
  const sx = {
    ...(rest.sx ?? {}),
    color,
  };
  return (
    <Typography {...rest} sx={sx} variant="caption">
      {prefixNode}
      {level}
    </Typography>
  );
};

interface IFuiLevelChip extends ChipProps {
  experience: Experience;
}
const FuiLevelChip: FC<IFuiLevelChip> = ({ experience, ...rest }) => {
  const { color } = useLevelColor(experience.level);
  return (
    <Chip
      {...rest}
      label={
        <Typography variant="caption" fontWeight="bold" color={color}>
          {`等级 ${experience.level} / ${experience.maxLevel}`}
        </Typography>
      }
    />
  );
};

interface IFuiExperienceChip extends ChipProps {
  experience: Experience;
}
const FuiExperienceChip: FC<IFuiExperienceChip> = ({ experience, ...rest }) => (
  <Chip {...rest} label={`${experience.experience} / ${experience.levelUpExperience}`} />
);

export { FuiLevelInfo, FuiLevelChip, FuiExperienceChip };

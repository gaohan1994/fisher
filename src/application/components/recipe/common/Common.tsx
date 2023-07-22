import { FC, PropsWithChildren, ReactNode } from 'react';
import StarIcon from '@mui/icons-material/Star';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

import { IconText } from '../../layout';

export const IntervalText: FC<PropsWithChildren> = ({ children }) => (
  <IconText icon={<AccessAlarmIcon />}>{children}</IconText>
);

export const ExperienceText: FC<PropsWithChildren> = ({ children }) => (
  <IconText icon={<EmojiEventsIcon />}>{children}</IconText>
);

export const RewardsText: FC<PropsWithChildren> = ({ children }) => <IconText icon={<StarIcon />}>{children}</IconText>;

const IntervalPrefix = '制作间隔：';
const IntervalSuffix = '秒';
const ExperiencePrefix = '经验奖励：';
const ExperienceSuffix = '点';

export const ForgeIntervalText: FC<PropsWithChildren> = ({ children }) => (
  <IntervalText>
    {IntervalPrefix}
    {children}
    {IntervalSuffix}
  </IntervalText>
);

export const ForgeExperienceText: FC<PropsWithChildren> = ({ children }) => (
  <ExperienceText>
    {ExperiencePrefix}
    {children}
    {ExperienceSuffix}
  </ExperienceText>
);

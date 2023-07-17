import { FC, PropsWithChildren } from 'react';
import StarIcon from '@mui/icons-material/Star';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

import { IconText } from '../layout';

export const IntervalText: FC<PropsWithChildren> = ({ children }) => (
  <IconText icon={<AccessAlarmIcon />}>{children}</IconText>
);

export const ExperienceText: FC<PropsWithChildren> = ({ children }) => (
  <IconText icon={<EmojiEventsIcon />}>{children}</IconText>
);

export const RewardsText: FC<PropsWithChildren> = ({ children }) => <IconText icon={<StarIcon />}>{children}</IconText>;

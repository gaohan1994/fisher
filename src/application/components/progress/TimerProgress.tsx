import { FC } from 'react';
import { Timer } from '@FisherCore';

import { Progress, ProgressProps } from './Progress';
import { useTimerProgress } from './Hook';

interface TimerProgessProps extends Omit<ProgressProps, 'value'> {
  timer: Timer;
}
export const TimerProgess: FC<TimerProgessProps> = ({ timer, ...rest }) => {
  const value = useTimerProgress(timer);
  return <Progress value={value} {...rest} />;
};

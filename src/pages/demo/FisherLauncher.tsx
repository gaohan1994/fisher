import { useEffect, FC } from 'react';
import { fisherLaunch } from '@FisherCore';

export const FisherLauncher: FC = () => {
  useEffect(() => {
    fisherLaunch();
  }, []);

  return null;
};

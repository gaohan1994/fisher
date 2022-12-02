import { useEffect, FC, lazy, Suspense } from 'react';
import { fisherLaunch } from '@FisherCore';
import { CircularProgress } from '@mui/material';

const FisherCoreDemo = lazy(() => import('./FisherCoreDemo'));

export const FisherLauncher: FC = () => {
  useEffect(() => {
    const fisherCore = fisherLaunch();
    return () => {
      fisherCore.dispose();
    };
  }, []);

  return (
    <Suspense fallback={<CircularProgress color="secondary" />}>
      <FisherCoreDemo />
    </Suspense>
  );
};

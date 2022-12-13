import { useEffect, FC, useState } from 'react';
import { CircularProgress } from '@mui/material';
import { FisherCore } from '@FisherCore';
import { prefixLogger, prefixes } from '@FisherLogger';
import FisherCoreDemo from './FisherCoreDemo';

const logger = prefixLogger(prefixes.COMPONENTS, 'Launcher');

function launchFisherGame(): Promise<FisherCore> {
  logger.info('Fisher launch!');
  const fisher = new FisherCore();

  logger.info('Inject fisherCore into window object');
  typeof window !== undefined && (window.fisher = fisher);

  return Promise.resolve(fisher);
}

export const FisherLauncher: FC = () => {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    launchFisherGame().then(() => {
      setInitialized(true);
    });
  }, []);

  return initialized ? (
    <FisherCoreDemo />
  ) : (
    <CircularProgress color="secondary" />
  );
};

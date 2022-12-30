import { useEffect, FC, useState } from 'react';
import { CircularProgress } from '@mui/material';
import { createFisherStore, FisherCore } from '@FisherCore';
import { prefixLogger, prefixes } from '@FisherLogger';
import FisherCoreDemo from './FisherCoreDemo';

const logger = prefixLogger(prefixes.COMPONENTS, 'Launcher');

async function launchFisherGame(): Promise<FisherCore> {
  logger.info('Fisher launch!');
  await createFisherStore();

  const fisher = new FisherCore();
  typeof window !== undefined && ((window as any).fisher = fisher);
  logger.info('Inject fisherCore into window object');

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

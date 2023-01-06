import { Fragment, FC, useEffect } from 'react';
import { Button, CircularProgress, Stack } from '@mui/material';
import { core } from '@FisherCore';
import { prefixLogger, prefixes } from '@FisherLogger';
import FisherCoreDemo from './FisherCoreDemo';
import { observer } from 'mobx-react';

const logger = prefixLogger(prefixes.COMPONENTS, 'Launcher');

export const FisherLauncher: FC = observer(() => {
  useEffect(() => {
    core.setArchive({ name: 'archive' });
  }, []);

  const loadArchive = () => {
    core.setArchive({ name: 'archive' });
  };

  return (
    <div>
      {core.gameReady ? (
        <FisherCoreDemo />
      ) : (
        <Fragment>
          <Stack>
            <Button onClick={loadArchive}>Load Archive</Button>
          </Stack>
          <CircularProgress color="secondary" />
        </Fragment>
      )}
    </div>
  );
});

import { Fragment, FC } from 'react';
import { Box, CircularProgress, Stack, Typography } from '@mui/material';
import { core } from '@FisherCore';
import { prefixLogger, prefixes } from '@FisherLogger';
import FisherCoreDemo from './FisherCoreDemo';
import { observer } from 'mobx-react';
import { FuiArchive, FuiArchiveCreator } from '@Components';

export const FisherLauncher: FC = observer(() => {
  const { archiveManager } = core;

  return (
    <div>
      <FisherCoreDemo />
      {core.gameReady ? (
        <FisherCoreDemo />
      ) : (
        <Fragment>
          {archiveManager.hasArchive ? (
            <Stack spacing={1}>
              {archiveManager.archiveList.map((item) => (
                <FuiArchive key={item.archiveKey} archive={item} />
              ))}
            </Stack>
          ) : (
            <Typography>archive list empty</Typography>
          )}
          <Box sx={{ width: 400, mt: 1 }}>
            <Stack spacing={1}>
              <FuiArchiveCreator />
            </Stack>
          </Box>
          <CircularProgress color="secondary" />
        </Fragment>
      )}
    </div>
  );
});

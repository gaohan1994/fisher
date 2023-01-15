import { FC, Fragment } from 'react';
import { observer } from 'mobx-react';
import { Box, Typography, List, ListItem, ListSubheader } from '@mui/material';
import { core } from '@FisherCore';
import { FuiArchive } from './Archive';

const FuiArchiveList: FC = observer(() => {
  const { archiveManager } = core;

  const ArchiveListHead = () => <ListSubheader>共 {archiveManager.archiveList.length} 个存档 </ListSubheader>;

  if (!archiveManager.hasArchive) {
    return (
      <Box mb={2}>
        <ArchiveListHead />
        <Typography variant="h5" textAlign="center">
          存档列表空，请选择开始新游戏
        </Typography>
      </Box>
    );
  }

  return (
    <Fragment>
      <ArchiveListHead />
      <List
        sx={{
          overflow: 'auto',
          maxHeight: '70vh',
          pt: 0,
        }}
      >
        {archiveManager.archiveList.map((item) => (
          <ListItem key={item.archiveKey} sx={{ mb: 2 }}>
            <FuiArchive archive={item} />
          </ListItem>
        ))}
      </List>
    </Fragment>
  );
});

export { FuiArchiveList };

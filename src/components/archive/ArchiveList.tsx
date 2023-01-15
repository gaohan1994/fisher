import { FC } from 'react';
import { observer } from 'mobx-react';
import { Box, Typography, List, ListItem, ListSubheader } from '@mui/material';
import { core } from '@FisherCore';
import { FuiArchive } from './Archive';

const FuiArchiveList: FC = observer(() => {
  const { archiveManager } = core;

  if (!archiveManager.hasArchive) {
    return (
      <Box mb={2}>
        <Typography variant="h5" textAlign="center">
          存档列表空，请选择开始新游戏
        </Typography>
      </Box>
    );
  }

  return (
    <List
      sx={{
        overflow: 'auto',
        maxHeight: 800,
        pt: 0,
      }}
    >
      <ListSubheader>共 {archiveManager.archiveList.length} 个存档 </ListSubheader>
      {archiveManager.archiveList.map((item) => (
        <ListItem key={item.archiveKey} sx={{ p: 0, mb: 2 }}>
          <FuiArchive archive={item} />
        </ListItem>
      ))}
    </List>
  );
});

export { FuiArchiveList };

import { FC, Fragment } from 'react';
import { observer } from 'mobx-react';
import { styled, Box, Typography, List, ListItem, IconButton, Stack, Tooltip } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { core } from '@FisherCore';
import { FuiArchive } from './Archive';

const Div = styled('div')(({ theme }) => ({
  ...theme.typography.button,
  padding: theme.spacing(1),
}));

const FuiArchiveList: FC = observer(() => {
  const { archiveManager } = core;

  const RefreshButton = () => (
    <Tooltip title="刷新">
      <IconButton>
        <RefreshIcon />
      </IconButton>
    </Tooltip>
  );

  const ArchiveListHead = () => (
    <Stack direction="row" sx={{ mb: 1 }}>
      <Div sx={{ flex: 1 }}>共 {archiveManager.archiveList.length} 个存档</Div>
      <RefreshButton />
    </Stack>
  );

  if (!archiveManager.hasArchive) {
    return (
      <Box mb={1}>
        <ArchiveListHead />
        <Typography variant="h5" textAlign="center" component="div" sx={{ mt: 2 }}>
          存档列表空，请创建新角色
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
          p: 0,
        }}
      >
        {archiveManager.archiveList.map((item) => (
          <ListItem key={item.archiveKey} sx={{ pl: 0, pr: 0 }}>
            <FuiArchive archive={item} />
          </ListItem>
        ))}
      </List>
    </Fragment>
  );
});

export { FuiArchiveList };

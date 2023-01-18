import { FC } from 'react';
import { observer } from 'mobx-react';
import { Fab, Avatar, Tooltip, Box, Collapse } from '@mui/material';
import { master } from '@FisherCore';
import { miniBarStore } from './MiniBarStore';
import { FuiMaster } from './Master';

const FuiMiniBar: FC = observer(() => {
  const renderFloatButton = () => (
    <Tooltip title="角色详情" placement="bottom">
      <Fab onClick={miniBarStore.toggleMiniBar}>
        <Avatar src={master.media} />
      </Fab>
    </Tooltip>
  );

  return (
    <Box
      sx={{
        position: 'fixed',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'end',
        right: 30,
        bottom: 60,
        zIndex: 1000,
      }}
    >
      <Collapse in={miniBarStore.visible} sx={{ mb: 1 }}>
        <FuiMaster />
      </Collapse>
      {renderFloatButton()}
    </Box>
  );
});

export { FuiMiniBar };

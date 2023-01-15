import { FC } from 'react';
import { observer } from 'mobx-react';
import { Box, Button, Tooltip } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { core } from '@FisherCore';

const ExitButton: FC = observer(() => {
  const { archiveManager } = core;
  return (
    <Tooltip title="退出游戏到选择存档界面">
      <Button variant="contained" startIcon={<LogoutIcon />} onClick={() => archiveManager.exitActiveArchive()}>
        退出
      </Button>
    </Tooltip>
  );
});

const FuiSetting: FC = observer(() => {
  return (
    <Box sx={{ width: 200 }}>
      <ExitButton />
    </Box>
  );
});

export { FuiSetting };

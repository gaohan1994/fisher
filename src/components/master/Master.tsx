import { Typography, Card, CardContent, CardHeader, Avatar, IconButton, Stack } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Assets, core } from '@FisherCore';
import { miniBarStore } from './MiniBarStore';
import { FuiColor } from '../theme';
import { FuiMasterEquipments } from './Equipments';
import { FuiMasterPanel } from './Panel';

const FuiMaster = () => {
  const { master } = core;
  return (
    <Card sx={{ bgcolor: FuiColor.masterPanel.background }}>
      <CardHeader
        title={<Typography color={FuiColor.common.white}>{master.name}</Typography>}
        avatar={<Avatar src={Assets.avatar} sx={{ bgcolor: FuiColor.masterPanel.avatarBgColor }} />}
        action={
          <IconButton onClick={miniBarStore.closeMiniBar} sx={{ color: FuiColor.common.white }}>
            <CloseIcon />
          </IconButton>
        }
      />
      <CardContent>
        <Stack direction="row" spacing={1} justifyContent="space-between">
          <FuiMasterEquipments />
          <FuiMasterPanel />
        </Stack>
      </CardContent>
    </Card>
  );
};

export { FuiMaster };

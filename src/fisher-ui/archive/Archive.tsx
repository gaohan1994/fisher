import { FC, useCallback, Fragment, useState } from 'react';
import dayjs from 'dayjs';
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Card,
  CardContent,
  Typography,
  CardActions,
  Tooltip,
  CardActionArea,
  Stack,
  Avatar,
  styled,
  Box,
} from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Archive, Assets, core } from '@FisherCore';
import { notifycationStore } from '../notifycation';
import { FuiColor } from '../theme';

interface Props {
  archive: Archive;
}

const BetweenStack = styled(Stack)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
}));

function formatTime(timestramp: number) {
  return dayjs(timestramp).format('YYYY-MM-DD HH:MM');
}

const FuiArchiveDeleteButton: FC<Props> = ({ archive }) => {
  const { archiveManager } = core;
  const [open, setOpen] = useState(false);

  const onOpen = () => setOpen(true);
  const onClose = () => setOpen(false);

  const onDeleteArchive = useCallback(async () => {
    if (archiveManager.activeArchive?.archiveKey === archive.archiveKey) {
      return notifycationStore.alert('error', '不可以删除正在使用的存档！');
    }

    await archiveManager.deleteArchive(archive.archiveKey);
    notifycationStore.alert('success', `成功删除存档 ${archive.masterName}`);
  }, [archive, archiveManager.activeArchive]);

  return (
    <Fragment>
      <Tooltip title="删除这个存档，数据将会丢失">
        <Button onClick={onOpen} endIcon={<DeleteForeverIcon />} color="error" size="small" variant="contained">
          删除存档
        </Button>
      </Tooltip>
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            确定删除存档 {archive.masterName} 么? 删除存档后数据将无法找回
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>取消</Button>
          <Button onClick={onDeleteArchive} color="error">
            确定
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

const FuiArchive: FC<Props> = ({ archive }) => {
  const { archiveManager } = core;

  const onLoadArchive = useCallback(async () => {
    await archiveManager.loadArchive(archive.archiveKey);
  }, [archive, archiveManager]);

  return (
    <Card variant="outlined" sx={{ width: '100%', bgcolor: FuiColor.primary.background }}>
      <CardActionArea onClick={onLoadArchive}>
        <CardContent>
          <BetweenStack direction="row">
            <Box>
              <Typography variant="h5" mb={1}>
                {archive.masterName}
              </Typography>
              <Typography>当前活动：{archive.activeComponentId}</Typography>
              <Typography>等级：50</Typography>
              <Typography mb={1} color={FuiColor.gold}>
                金币：{archive.bank?.gold ?? 0}
              </Typography>
            </Box>

            <Stack direction="column" alignItems="flex-end">
              <Avatar src={Assets.logo} />
              <Typography variant="body2" color="text.secondary">
                存档创建时间：{formatTime(archive.createTime)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                最后更新时间：{formatTime(archive.lastUpdateTime)}
              </Typography>
            </Stack>
          </BetweenStack>
        </CardContent>
      </CardActionArea>
      <CardActions sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
        <FuiArchiveDeleteButton archive={archive} />
      </CardActions>
    </Card>
  );
};
export { FuiArchive };

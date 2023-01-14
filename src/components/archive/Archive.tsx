import { FC, useCallback } from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import { Archive, core } from '@FisherCore';
import { notifycationStore } from '../notifycation';

interface Props {
  archive: Archive;
}

const FuiArchive: FC<Props> = ({ archive }) => {
  const { archiveManager } = core;

  const onDeleteArchive = useCallback(async () => {
    if (archiveManager.activeArchive?.archiveKey === archive.archiveKey) {
      return notifycationStore.alert('error', '不可以删除正在使用的存档！');
    }

    await archiveManager.deleteArchive(archive.archiveKey);
    notifycationStore.alert('success', `删除存档 ${archive.masterName}`);
  }, [archive, archiveManager.activeArchive]);

  return (
    <Box sx={{ border: 1, padding: 1 }}>
      <Typography>存档：{archive.archiveKey}</Typography>
      <Typography>创建时间：{archive.createTime}</Typography>
      <Typography>最后更新时间：{archive.lastUpdateTime}</Typography>
      <Typography>玩家姓名：{archive.masterName}</Typography>
      <Typography>金币：{archive.bank?.gold ?? 0}</Typography>
      <Stack>
        <Button variant="contained">加载存档</Button>
        <Button variant="contained" onClick={onDeleteArchive}>
          删除存档
        </Button>
      </Stack>
    </Box>
  );
};
export { FuiArchive };

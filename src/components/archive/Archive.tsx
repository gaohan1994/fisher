import { FC } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Archive } from '@FisherCore';

interface Props {
  archive: Archive;
}

const FuiArchive: FC<Props> = ({ archive }) => {
  return (
    <Box sx={{ border: 1, padding: 1 }}>
      <Typography>存档：{archive.archiveKey}</Typography>
      <Typography>创建时间：{archive.createTime}</Typography>
      <Typography>最后更新时间：{archive.lastUpdateTime}</Typography>
      <Typography>玩家姓名：{archive.masterName}</Typography>
      <Typography>金币：{archive.bank?.gold ?? 0}</Typography>
      <Button variant="contained">加载存档</Button>
    </Box>
  );
};
export { FuiArchive };

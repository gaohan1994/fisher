import { Box, Typography } from '@mui/material';

const FuiAuthor = () => {
  return (
    <Box sx={{ position: 'fixed', left: 30, bottom: 30 }}>
      <Typography variant="body2" component="div">
        作者 高南安
      </Typography>
      <Typography variant="caption" color="secondary.main" component="div">
        该游戏处于早期阶段，在肝了
      </Typography>
      <Typography variant="caption" color="secondary.main" component="div">
        联系方式 Q 871418277
      </Typography>
      <Typography variant="caption" color="secondary.main" component="div">
        图片资源来自 flaticon 如有侵权请联系作者删除
      </Typography>
    </Box>
  );
};

export { FuiAuthor };

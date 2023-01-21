import { observer } from 'mobx-react';
import { Avatar, Box, Toolbar, Typography, AppBar, IconButton, Tooltip, Button } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import { Assets, core, version } from '@FisherCore';
import { FuiColor } from '../theme';
import { FuiSettingButton } from './Setting';

const GithubButton = () => {
  const onGithub = () => {
    window.open('https://github.com/gaohan1994/fisher', 'fisher');
  };
  return (
    <Tooltip title="去gayhub点个赞">
      <IconButton size="large" onClick={onGithub} color="inherit">
        <GitHubIcon />
      </IconButton>
    </Tooltip>
  );
};

const FuiSlogan = () => (
  <Typography component="div" sx={{ ml: 1, flexGrow: 1 }}>
    Fisher - 一个放置类 MMO 游戏
  </Typography>
);

const ActiveTitle = observer(() => {
  return (
    <Typography component="div" sx={{ ml: 1, flexGrow: 1 }}>
      {core.master.name} - {core.activeComponent?.name}
    </Typography>
  );
});

const FuiAppbar = observer(() => {
  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: FuiColor.primary.background }}>
      <Toolbar>
        <Avatar src={Assets.logo} />
        {core.gameReady ? <ActiveTitle /> : <FuiSlogan />}
        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
          <Button sx={{ color: '#fff' }}>v{version}</Button>
          <GithubButton />
          <FuiSettingButton />
        </Box>
      </Toolbar>
    </AppBar>
  );
});

export { FuiAppbar };

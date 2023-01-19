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

const FuiAppbar = observer(() => {
  const { activeComponent } = core;

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: FuiColor.appbar.background }}>
      <Toolbar>
        <Avatar src={Assets.logo} />
        <Typography component="div" sx={{ ml: 1, flexGrow: 1 }}>
          Fisher - {activeComponent !== undefined ? activeComponent.name : '一个放置类 MMO 游戏'}
        </Typography>
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

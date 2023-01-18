import { observer } from 'mobx-react';
import { Avatar, Box, Toolbar, Typography, AppBar, IconButton, Tooltip, Button } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import { Assets, core, version } from '@FisherCore';

const FuiAppbar = observer(() => {
  const { activeComponent } = core;

  const onGithub = () => {
    window.open('https://github.com/gaohan1994/fisher', 'fisher');
  };

  return (
    <Toolbar>
      <Box sx={{ display: 'flex' }}>
        <AppBar>
          <Toolbar>
            <Avatar src={Assets.logo} />
            <Typography component="div" sx={{ ml: 1, flexGrow: 1 }}>
              Fisher - {activeComponent !== undefined ? activeComponent.name : '一个放置类 MMO 游戏'}
            </Typography>
            <Box>
              <Button sx={{ color: '#fff' }}>v{version}</Button>
              <Tooltip title="去gayhub点个赞">
                <IconButton size="large" onClick={onGithub} color="inherit">
                  <GitHubIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
    </Toolbar>
  );
});

export { FuiAppbar };

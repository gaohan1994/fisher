import React from 'react';
import { observer } from 'mobx-react';
import { useNavigate } from 'react-router';
import { IconButton, Tooltip, Menu, MenuItem } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useArchiveManager } from '../../core';

const FuiSettingButton = observer(() => {
  const archiveManager = useArchiveManager();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Tooltip title="设置">
        <IconButton size="large" color="inherit" onClick={handleMenu}>
          <MoreHorizIcon />
        </IconButton>
      </Tooltip>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => navigate('/')}>关于</MenuItem>
        <MenuItem
          onClick={() => {
            archiveManager.exitActiveArchive();
            handleClose();
          }}
        >
          选择角色
        </MenuItem>
      </Menu>
    </div>
  );
});

export { FuiSettingButton };

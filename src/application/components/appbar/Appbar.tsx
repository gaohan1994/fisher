import { observer } from 'mobx-react';
import { Avatar, Toolbar, IconButton, Tooltip, Button } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import DataSaverOnIcon from '@mui/icons-material/DataSaverOn';
import { Assets } from '@FisherCore';

// @todo fix notifycation when refactor notifycation component
// import { notifycationStore } from '../notifycation';
import { useArchiveManager } from '../../core';

import { FuiSettingButton } from './SettingButton';
import { useActiveComponentName, useGameVersion } from './Hook';
import { AppBarContainer, AppbarActionsContainer, AppbarTypography } from './Styled';

const ArchiveSaveButton = observer(() => {
  const archiveManager = useArchiveManager();
  const onSaveArchive = async () => {
    await archiveManager.onSaveFullArchive();
    // notifycationStore.alert('success', '保存成功');
  };
  return (
    <Tooltip title="全量保存">
      <Button startIcon={<DataSaverOnIcon />} onClick={onSaveArchive} variant="contained" size="large" color="success">
        保存
      </Button>
    </Tooltip>
  );
});

const GithubButton = () => (
  <Tooltip title="去gayhub点个赞">
    <IconButton
      size="large"
      color="inherit"
      onClick={() => {
        window.open('https://github.com/gaohan1994/fisher', 'fisher');
      }}
    >
      <GitHubIcon />
    </IconButton>
  </Tooltip>
);

const FuiAppbar = observer(() => {
  const version = useGameVersion();
  const activeComponentName = useActiveComponentName();
  const title = <AppbarTypography>{`当前活动：${activeComponentName}`}</AppbarTypography>;
  return (
    <AppBarContainer position="fixed">
      <Toolbar>
        <Avatar src={Assets.logo} />
        {title}
        <AppbarActionsContainer>
          <ArchiveSaveButton />
          <Button>{version}</Button>
          <GithubButton />
          <FuiSettingButton />
        </AppbarActionsContainer>
      </Toolbar>
    </AppBarContainer>
  );
});

export { FuiAppbar };

import { FC, Fragment, useCallback, useState } from 'react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from '@mui/material';
import { core } from '@FisherCore';
import { notifycationStore } from '../notifycation';

const ArchiveCreateModal: FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const [masterName, setMasterName] = useState('');

  const onConfrimCreateArchive = useCallback(async () => {
    if (!masterName || masterName.length < 1) {
      return notifycationStore.alert('error', '请输入合法的游戏姓名');
    }

    await core.archiveManager.createNewArchive(masterName);
    openSuccessTipMessage();
    onClose();
    setMasterName('');
  }, [masterName]);

  const openSuccessTipMessage = useCallback(() => {
    notifycationStore.alert('success', `${masterName}创建成功`);
  }, [masterName]);

  return (
    <Fragment>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
        <DialogTitle>新建角色</DialogTitle>
        <DialogContent>
          <Stack>
            <TextField
              required
              sx={{ mt: 1, mb: 2 }}
              id="outlined-basic"
              label="请输入玩家姓名"
              variant="outlined"
              value={masterName}
              onChange={(event) => setMasterName(event.target.value)}
            />
            <Button variant="contained" onClick={onConfrimCreateArchive}>
              开始游戏
            </Button>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>取消</Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

const FuiArchiveCreateButton: FC = () => {
  const [open, setOpen] = useState(false);
  return (
    <Fragment>
      <ArchiveCreateModal open={open} onClose={() => setOpen(false)} />
      <Button
        fullWidth
        size="large"
        variant="contained"
        color="primary"
        sx={{ mt: 1 }}
        onClick={() => setOpen(true)}
        endIcon={<AddCircleOutlineIcon />}
      >
        创建新角色
      </Button>
    </Fragment>
  );
};

export { FuiArchiveCreateButton };

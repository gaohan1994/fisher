import { FC, Fragment, useCallback, useState } from 'react';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Stack,
  TextField,
} from '@mui/material';
import { core } from '@FisherCore';

const errorMessage = {
  type: 'error',
  message: '请输入合法的游戏姓名',
};

const ArchiveCreateModal: FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const [tipOpen, setTipOpen] = useState(false);
  const [tipMessage, setTipMessage] = useState<{ type: string; message: string } | undefined>();
  const [masterName, setMasterName] = useState('');

  const onConfrimCreateArchive = useCallback(async () => {
    if (!masterName || masterName.length < 1) {
      return openErrorTipMessage();
    }

    await core.archiveManager.createNewArchive(masterName);
    openSuccessTipMessage();
    onClose();
    setMasterName('');
  }, [masterName]);

  const openErrorTipMessage = () => {
    setTipMessage(errorMessage);
    setTipOpen(true);
  };

  const openSuccessTipMessage = useCallback(() => {
    setTipMessage({ type: 'success', message: `${masterName}创建成功` });
    setTipOpen(true);
  }, [masterName]);

  return (
    <Fragment>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>新建存档</DialogTitle>
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
              确定
            </Button>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>取消</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={tipOpen}
        autoHideDuration={2000}
        onClose={() => setTipOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        {tipMessage && (
          <Alert onClose={onClose} severity={tipMessage.type as any} sx={{ width: '100%' }}>
            {tipMessage.message}
          </Alert>
        )}
      </Snackbar>
    </Fragment>
  );
};

const FuiArchiveCreator: FC = () => {
  const [open, setOpen] = useState(false);
  return (
    <Fragment>
      <ArchiveCreateModal open={open} onClose={() => setOpen(false)} />
      <Button variant="contained" onClick={() => setOpen(true)}>
        新建存档
      </Button>
    </Fragment>
  );
};

export { FuiArchiveCreator };

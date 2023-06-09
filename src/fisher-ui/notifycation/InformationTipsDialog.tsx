import React from 'react';
import { observer } from 'mobx-react';
import { Information, InformationMessage } from '@FisherCore';
import { IconButton, Snackbar, SnackbarContent } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { MessageParer } from './MessageParser';
import { FuiColor } from '../theme';

interface ICoreInformationMessageHandler {
  information: Information;
}

const CoreInformationTips: React.FC<ICoreInformationMessageHandler> = observer(({ information }) => {
  const [open, setOpen] = React.useState(false);
  const [snackPack, setSnackPack] = React.useState<readonly MessageParer[]>([]);
  const [messageInfo, setMessageInfo] = React.useState<MessageParer | undefined>(undefined);

  React.useEffect(() => {
    const unsubscribe = information.event.on(
      Information.InformationEventKeys.TipMessage,
      (messages: InformationMessage[]) => {
        setSnackPack((prev) => [...prev, new MessageParer(messages)]);
      }
    );
    return () => {
      unsubscribe();
    };
  }, [information]);

  React.useEffect(() => {
    if (snackPack.length && !messageInfo) {
      // Set a new snack when we don't have an active one
      setMessageInfo({ ...snackPack[0] });
      setSnackPack((prev) => prev.slice(1));
      setOpen(true);
    } else if (snackPack.length && messageInfo && open) {
      // Close an active snack when a new one is added
      setOpen(false);
    }
  }, [snackPack, messageInfo, open]);

  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const handleExited = () => {
    setMessageInfo(undefined);
  };

  const action = (
    <IconButton size="small" aria-label="close" color="error" onClick={handleClose}>
      <CloseIcon fontSize="small" />
    </IconButton>
  );

  return (
    <Snackbar
      open={open}
      autoHideDuration={1500}
      onClose={handleClose}
      TransitionProps={{ onExited: handleExited }}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      sx={{ maxHeight: '60vh', overflow: 'overlay' }}
    >
      <SnackbarContent
        action={action}
        sx={{ background: FuiColor.primary.background }}
        message={messageInfo ? messageInfo.toMessage() : undefined}
      />
    </Snackbar>
  );
});

export { CoreInformationTips };

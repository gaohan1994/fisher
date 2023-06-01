import React, { FC, Fragment } from 'react';
import { observer } from 'mobx-react';
import {
  Alert,
  Snackbar,
  SnackbarContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
} from '@mui/material';
import { core, Information } from '@FisherCore';
import type { InformationMessage } from '@FisherCore';
import { notifycationStore } from './NotifycationStore';
import { MessageParer } from './MessageParser';
import { FuiColor } from '../theme';
import { useArray } from '../../application/hook/UseArray';

const FuiNotifycation: FC = observer(() => {
  const { information } = core;
  return (
    <Fragment>
      <CoreInformationAlerts information={information} />
      <CoreInformationTips information={information} />
      <Alerts />
    </Fragment>
  );
});

const Alerts: FC = observer(() => {
  const { alerts } = notifycationStore;
  const open = Boolean(alerts.length);

  if (!open) {
    return null;
  }

  return (
    <Fragment>
      {alerts.map((item, index) => {
        const [alert, dispose] = item;
        return (
          <Snackbar
            open={open}
            key={`${alert.message}${index}`}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert onClose={dispose.disposer} severity={alert.color} sx={{ width: '100%' }}>
              {alert.message}
            </Alert>
          </Snackbar>
        );
      })}
    </Fragment>
  );
});

interface ICoreInformationMessageHandler {
  information: Information;
}

const CoreInformationAlerts: FC<ICoreInformationMessageHandler> = observer(({ information }) => {
  const [open, setOpen] = React.useState(false);
  const { value, push, isEmpty, clear } = useArray<MessageParer>([]);

  React.useEffect(() => {
    const unsubscribe = information.event.on(
      Information.InformationEventKeys.AlertMessage,
      (messages: InformationMessage[]) => {
        push(new MessageParer(messages));
      }
    );
    return () => {
      unsubscribe();
    };
  }, [information]);

  React.useEffect(() => {
    if (!isEmpty()) {
      setOpen(true);
    }
  }, [isEmpty]);

  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
    clear();
  };

  const handleExited = () => {
    clear();
  };

  return (
    <Dialog
      open={open}
      fullWidth={false}
      scroll="paper"
      maxWidth="md"
      onClose={handleClose}
      TransitionProps={{ onExited: handleExited }}
    >
      <DialogTitle>提示</DialogTitle>
      <DialogContent sx={{ minWidth: 300 }}>
        {value &&
          value.map((parser, index) => {
            return (
              <Box key={`${index}${parser.date}`} sx={{ mb: 1 }}>
                <Typography variant="body2">{parser.date}</Typography>
                {parser.toMessage()}
              </Box>
            );
          })}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} autoFocus>
          好
        </Button>
      </DialogActions>
    </Dialog>
  );
});

const CoreInformationTips: FC<ICoreInformationMessageHandler> = observer(({ information }) => {
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

  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={handleClose}
      TransitionProps={{ onExited: handleExited }}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <SnackbarContent
        sx={{ background: FuiColor.primary.background }}
        message={messageInfo ? messageInfo.toMessage() : undefined}
      />
    </Snackbar>
  );
});

export { FuiNotifycation };

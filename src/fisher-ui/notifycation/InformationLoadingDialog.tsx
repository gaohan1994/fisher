import React from 'react';
import { observer } from 'mobx-react';
import { Information, InformationMessage } from '@FisherCore';
import { useArray } from '../../application/hook/UseArray';
import { MessageParer } from './MessageParser';
import { CenterBox } from '../container';
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { GoldenButton } from './Action';

interface ICoreInformationMessageHandler {
  information: Information;
}

const CoreInformationLoading: React.FC<ICoreInformationMessageHandler> = observer(({ information }) => {
  const [open, setOpen] = React.useState(false);
  const { value, push, clear } = useArray<MessageParer>([]);

  React.useEffect(() => {
    const unsubscribes = [
      information.event.on(
        Information.InformationEventKeys.Loading,
        (loading: boolean, messages: InformationMessage[] = []) => {
          setOpen(loading);
          push(new MessageParer(messages));
        }
      ),
    ];

    return () => unsubscribes.forEach((unsubscribe) => unsubscribe());
  }, [information]);

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

  const renderLoadingMessages = (
    <CenterBox direction="column">
      <CircularProgress color="success" sx={{ mb: 2 }} />
      {value && value.map((parser) => parser.toMessage())}
    </CenterBox>
  );

  const renderLoadingMessagesAction = (
    <GoldenButton onClick={handleClose} autoFocus>
      最小化
    </GoldenButton>
  );

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
      <DialogContent sx={{ minWidth: 300 }}>{renderLoadingMessages}</DialogContent>
      <DialogActions>{renderLoadingMessagesAction}</DialogActions>
    </Dialog>
  );
});

export { CoreInformationLoading };

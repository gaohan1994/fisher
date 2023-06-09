import React from 'react';
import { Information, InformationMessage } from '@FisherCore';
import { observer } from 'mobx-react';
import { MessageParer } from './MessageParser';
import { useArray } from '../../application/hook/UseArray';
import { Box, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { GoldenButton } from './Action';

interface ICoreInformationMessageHandler {
  information: Information;
}

const CoreInformationAlerts: React.FC<ICoreInformationMessageHandler> = observer(({ information }) => {
  const [open, setOpen] = React.useState(false);
  const { value, push, isEmpty, clear } = useArray<MessageParer>([]);

  React.useEffect(() => {
    const unsubscribe = information.event.on(
      Information.InformationEventKeys.AlertMessage,
      (messages: InformationMessage[]) => {
        push(new MessageParer(messages));
      }
    );

    return () => unsubscribe();
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

  const renderAlertMessages =
    value &&
    value.map((parser, index) => (
      <Box key={`${index}${parser.date}`} sx={{ mb: 1 }}>
        <Typography variant="body2">{parser.date}</Typography>
        {parser.toMessage()}
      </Box>
    ));

  const renderAlertMessagesAction = (
    <GoldenButton onClick={handleClose} autoFocus>
      好
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
      <DialogContent sx={{ minWidth: 300 }}>{renderAlertMessages}</DialogContent>
      <DialogActions>{renderAlertMessagesAction}</DialogActions>
    </Dialog>
  );
});

export { CoreInformationAlerts };

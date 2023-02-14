import { FC, Fragment } from 'react';
import { observer } from 'mobx-react';
import { Alert, Snackbar, SnackbarContent, Typography } from '@mui/material';
import { core } from '@FisherCore';
import { notifycationStore } from './NotifycationStore';

const CorePrompt: FC = observer(() => {
  const { prompt } = core;
  const open = Boolean(prompt.quene.length);

  const coreMessages = prompt.quene.map((item, index) => (
    <Typography key={`${item.item.id}${index}`}>
      获得：{item.item.name} x {item.quantity}
    </Typography>
  ));

  return (
    <Snackbar key="CorePrompt" open={open} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
      <SnackbarContent message={coreMessages} />
    </Snackbar>
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

const FuiNotifycation: FC = observer(() => {
  return (
    <Fragment>
      <Alerts />
      <CorePrompt />
    </Fragment>
  );
});

export { FuiNotifycation };

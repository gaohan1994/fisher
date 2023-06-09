import React from 'react';
import { observer } from 'mobx-react';
import { notifycationStore } from './NotifycationStore';
import { Alert, Snackbar } from '@mui/material';

const NotifycationAlerts: React.FC = observer(() => {
  const { alerts } = notifycationStore;
  const open = Boolean(alerts.length);

  if (!open) {
    return null;
  }

  return (
    <React.Fragment>
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
    </React.Fragment>
  );
});

export { NotifycationAlerts };

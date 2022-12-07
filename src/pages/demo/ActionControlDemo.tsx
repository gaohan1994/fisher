import { FC, useState } from 'react';
import { Button, Snackbar, Stack } from '@mui/material';
import { ActionControl } from '@FisherCore';
import { DemoLayout } from './DemoLayout';

const actionId = 'ACDemo';

export const ActionControlDemo: FC = () => {
  const [open, setOpen] = useState(false);
  const [actionControl] = useState(
    () =>
      new ActionControl({
        actionId,
        onActionStart: () => setOpen(true),
        onActionStop: () => setOpen(false),
      })
  );
  return (
    <DemoLayout title="ActionControl">
      <Snackbar
        open={open}
        message="ACDemo is active!"
        key={actionControl.actionId}
      />
      <div>点击 active 触发设置</div>
      <div>全局 active action 为当前 action</div>
      <Stack direction="row" spacing={1}>
        <Button variant="contained" onClick={actionControl.setActionActive}>
          active
        </Button>
        <Button variant="contained" onClick={actionControl.setActionInActive}>
          in-active
        </Button>
      </Stack>
    </DemoLayout>
  );
};

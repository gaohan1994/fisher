import { FC, PropsWithChildren } from 'react';
import { observer } from 'mobx-react';
import { ActionManager, FisherAction } from '@FisherCore';
import { FuiItem, FuiItemDetailPopover } from '../item';
import { Box, Stack } from '@mui/material';

interface IFuiFightStatusBar {
  actionManager: ActionManager;
}
const FuiFightStatusBar: FC<IFuiFightStatusBar> = observer(({ actionManager }) => {
  const { activeBuffActions, activeDebuffActions, activeDotActions } = actionManager;

  const StatusStack: FC<PropsWithChildren> = ({ children }) => (
    <Stack direction="row" spacing={0}>
      {children}
    </Stack>
  );

  return (
    <Box>
      <StatusStack>
        {activeBuffActions.map((action) => (
          <ActionItem key={action.key} action={action} />
        ))}
      </StatusStack>

      <StatusStack>
        {activeDebuffActions.map((action) => (
          <ActionItem key={action.key} action={action} />
        ))}
      </StatusStack>

      <StatusStack>
        {activeDotActions.map((action) => (
          <ActionItem key={action.key} action={action} />
        ))}
      </StatusStack>
    </Box>
  );
});

interface IActionItem {
  action: FisherAction;
}
const ActionItem: FC<IActionItem> = ({ action }) => (
  <FuiItem item={action as any} popover={FuiItemDetailPopover.MouseOver} showQuantity={false} />
);

export { FuiFightStatusBar };

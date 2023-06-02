import { FC, PropsWithChildren } from 'react';
import { observer } from 'mobx-react';
import { FisherAction, NormalItem } from '@FisherCore';
import { FuiItem, FuiItemDetailPopover } from '../item';
import { Stack } from '@mui/material';

interface IFuiFightStatusBar {
  actions: FisherAction[];
}
const FuiFightActions: FC<IFuiFightStatusBar> = observer(({ actions }) => {
  const StatusStack: FC<PropsWithChildren> = ({ children }) => (
    <Stack direction="row" spacing={0}>
      {children}
    </Stack>
  );

  return (
    <StatusStack>
      {actions.length === 0 && <EmptyAction />}
      {actions.map((action) => (
        <ActionItem key={action.key} action={action} />
      ))}
    </StatusStack>
  );
});

interface IActionItem {
  action: FisherAction;
}
const ActionItem: FC<IActionItem> = ({ action }) => (
  <FuiItem item={action as any} popover={FuiItemDetailPopover.MouseOver} showQuantity={false} />
);

const EmptyAction = () => {
  const action = new NormalItem({ name: '无', desc: '', id: 'EmptyAction', media: 'logo' });
  return <FuiItem item={action as any} popover={FuiItemDetailPopover.None} showQuantity={false} />;
};

export { FuiFightActions };

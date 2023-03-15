import React from 'react';
import { BaseDotAction } from '@FisherCore';
import { FuiItem, FuiItemDetailPopover } from './Item';

interface Props {
  dotAction: BaseDotAction;
}
const FuiDotAction: React.FC<Props> = ({ dotAction }) => (
  <FuiItem
    item={dotAction as any}
    showQuantity
    popover={FuiItemDetailPopover.None}
    quantity={dotAction.remainingEffectiveTimes}
  />
);

export { FuiDotAction };

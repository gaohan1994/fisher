import { FC, PropsWithChildren } from 'react';

import { PopoverItemProps, usePopoverHoc } from './Hoc';
import { ItemPopoverVariant } from './Constants';
import { FuiBaseItem, FuiBaseItemProps } from './BaseItem';

export interface FuiItemProps extends FuiBaseItemProps, PopoverItemProps {
  variant: ItemPopoverVariant;
}
export const FuiItem: FC<PropsWithChildren<FuiItemProps>> = ({ variant = ItemPopoverVariant.MouseOver, ...rest }) => {
  const Hoc = usePopoverHoc(FuiBaseItem, variant);
  return <Hoc {...rest} />;
};

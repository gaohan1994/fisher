import React, { FC, Fragment, useState } from 'react';

import { ItemPopoverVariant } from './Constants';
import { FuiItemDetail } from './Detail';
import { FuiItemPopover } from './Styled';
import { FuiBaseItemProps } from './BaseItem';

export interface PopoverItemProps {
  popover?: React.ReactNode;
}
export function usePopoverHoc<T extends FuiBaseItemProps>(Comp: FC<T>, variant: ItemPopoverVariant) {
  return function PopoverItem(props: T & PopoverItemProps) {
    const { item, popover, ...rest } = props;

    const [popoverEl, setPopoverEl] = useState<HTMLElement | null>(null);
    const open = Boolean(popoverEl);

    const isClickPopover = variant === ItemPopoverVariant.Click;
    const isMouseOverPopover = variant === ItemPopoverVariant.MouseOver;

    const openPopover = (event: React.MouseEvent<HTMLElement>) => {
      setPopoverEl(event.currentTarget);
    };

    const closePopover = () => {
      setPopoverEl(null);
    };

    const onClick = (event: React.MouseEvent<HTMLElement>) => {
      onItemClick(event);
      props?.onClick?.(event);
    };

    const onItemClick = (event: React.MouseEvent<HTMLElement>) => {
      if (isClickPopover) {
        openPopover(event);
      }
    };

    const onItemMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
      if (isMouseOverPopover) {
        openPopover(event);
      }
    };

    const onItemMouseLeave = () => {
      if (isMouseOverPopover) {
        closePopover();
      }
    };

    return (
      <Fragment>
        <Comp
          {...(rest as T)}
          item={item}
          aria-haspopup="true"
          aria-owns={open ? 'popover-open' : undefined}
          onClick={onClick}
          onMouseEnter={onItemMouseEnter}
          onMouseLeave={onItemMouseLeave}
        />
        <FuiItemPopover
          id="item-popover-description"
          open={open}
          variant={variant}
          anchorEl={popoverEl}
          onClose={closePopover}
        >
          <FuiItemDetail item={item}>{popover}</FuiItemDetail>
        </FuiItemPopover>
      </Fragment>
    );
  };
}

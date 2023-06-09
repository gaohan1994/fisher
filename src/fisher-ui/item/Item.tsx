import { FC, Fragment, useState, PropsWithChildren, ReactNode } from 'react';
import { Avatar, Box, Popover, Badge, styled, BadgeProps } from '@mui/material';
import { core, Item } from '@FisherCore';
import { FuiColor, FuiSize } from '../theme';
import { FuiItemDetail } from './ItemDetail';
import { observer } from 'mobx-react';

const StyledBadge = styled(Badge)<BadgeProps>(() => ({
  '& .MuiBadge-badge': {
    right: 10,
    bottom: 10,
  },
}));

enum FuiItemDetailPopover {
  None,
  MouseOver,
  Click,
}

interface FuiItemProps {
  item: Item;
  showBorder?: boolean;
  showQuantity?: boolean;
  quantity?: number;
  onClick?: (...rest: any[]) => void;
  itemDetail?: ReactNode;
  popoverDetail?: ReactNode;
  renderItem?: () => ReactNode;
  popover?: FuiItemDetailPopover;
}

const FuiItem: FC<PropsWithChildren<FuiItemProps>> = observer(
  ({
    item,
    showBorder,
    showQuantity,
    quantity,
    popover = FuiItemDetailPopover.MouseOver,
    onClick,
    itemDetail,
    popoverDetail,
    renderItem,
  }) => {
    const { backpack } = core;
    const [borderActive, setBorderActive] = useState(false);
    const [itemDesc, setItemDesc] = useState<HTMLElement | null>(null);

    const onItemMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
      showMouseOverPopover(event);
      setBorderActive(true);
    };

    const onItemMouseLeave = () => {
      closeMouseOverPopover();
      setBorderActive(false);
    };

    const showMouseOverPopover = (event: React.MouseEvent<HTMLElement>) => {
      if (popover === FuiItemDetailPopover.MouseOver) {
        setItemDesc(event.currentTarget);
      }
    };

    const closeMouseOverPopover = () => {
      if (popover === FuiItemDetailPopover.MouseOver) {
        setItemDesc(null);
      }
    };

    const showClickPopover = (event: React.MouseEvent<HTMLElement>) => {
      if (popover === FuiItemDetailPopover.Click) {
        setItemDesc(event.currentTarget);
      }
    };

    const closeItemDesc = () => {
      setItemDesc(null);
    };

    const onItemClick = (event: any) => {
      showClickPopover(event);
      onClick?.(event);
    };

    const open = Boolean(itemDesc);
    const itemQuantity = showQuantity ? quantity ?? backpack.getItem(item)?.quantity : undefined;

    return (
      <Fragment>
        <Box
          sx={{
            border: 1,
            width: 'fit-content',
            position: 'relative',
            borderColor:
              borderActive || open || showBorder ? FuiColor.item.activeBorderColor : FuiColor.item.borderColor,
          }}
          aria-owns={open ? 'equipment-popover' : undefined}
          aria-haspopup="true"
          onMouseEnter={onItemMouseEnter}
          onMouseLeave={onItemMouseLeave}
          onClick={onItemClick}
        >
          <StyledBadge
            badgeContent={itemQuantity}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
          >
            <Avatar
              src={item.media}
              variant="square"
              sx={{ width: FuiSize.item.size, height: FuiSize.item.size, p: 1, bgcolor: FuiColor.item.background }}
            />
          </StyledBadge>
          {renderItem?.()}
        </Box>
        <Popover
          id="equipment-popover"
          sx={popover === FuiItemDetailPopover.MouseOver ? { pointerEvents: 'none' } : {}}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          open={open}
          anchorEl={itemDesc}
          onClose={closeItemDesc}
          disableRestoreFocus
        >
          <FuiItemDetail item={item}>{itemDetail}</FuiItemDetail>
          {popoverDetail}
        </Popover>
      </Fragment>
    );
  }
);

export { FuiItem, FuiItemDetailPopover };
export type { FuiItemProps };

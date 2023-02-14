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

interface FuiItemProps {
  item: Item;
  showBorder?: boolean;
  showQuantity?: boolean;
  onClick?: () => void;
  renderDetail?: () => ReactNode;
  renderItem?: () => ReactNode;
}

const FuiItem: FC<PropsWithChildren<FuiItemProps>> = observer(
  ({ item, showBorder, showQuantity, onClick, renderDetail, renderItem }) => {
    const { backpack } = core;
    const [itemDesc, setItemDesc] = useState<HTMLElement | null>(null);

    const showItemDesc = (event: React.MouseEvent<HTMLElement>) => {
      setItemDesc(event.currentTarget);
    };

    const closeItemDesc = () => {
      setItemDesc(null);
    };

    const open = Boolean(itemDesc);
    const itemQuantity = showQuantity ? backpack.getItem(item)?.quantity : undefined;

    return (
      <Fragment>
        <Box
          sx={{
            border: 1,
            position: 'relative',
            borderColor: open || showBorder ? FuiColor.item.activeBorderColor : FuiColor.item.borderColor,
          }}
          aria-owns={open ? 'mouse-over-popover' : undefined}
          aria-haspopup="true"
          onMouseEnter={showItemDesc}
          onMouseLeave={closeItemDesc}
          onClick={onClick}
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
          id="mouse-over-popover"
          sx={{ pointerEvents: 'none' }}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={open}
          anchorEl={itemDesc}
          onClose={closeItemDesc}
          disableRestoreFocus
        >
          <FuiItemDetail item={item}>{renderDetail?.()}</FuiItemDetail>
        </Popover>
      </Fragment>
    );
  }
);

export { FuiItem };
export type { FuiItemProps };

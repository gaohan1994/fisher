import { FC, Fragment, useState, PropsWithChildren, ReactNode } from 'react';
import { Avatar, Box, colors, Popover, Stack, Typography, Card, CardHeader, CardContent } from '@mui/material';
import { coinItem, Item } from '@FisherCore';
import { FuiColor, FuiSize } from '../theme';

interface FuiItemProps {
  item: Item;
  onClick?: () => void;
  renderPopover?: () => ReactNode;
}

export const FuiItem: FC<PropsWithChildren<FuiItemProps>> = ({ item, onClick, renderPopover }) => {
  const [itemDesc, setItemDesc] = useState<HTMLElement | null>(null);

  const showItemDesc = (event: React.MouseEvent<HTMLElement>) => {
    setItemDesc(event.currentTarget);
  };

  const closeItemDesc = () => {
    setItemDesc(null);
  };

  const open = Boolean(itemDesc);
  return (
    <Fragment>
      <Box
        sx={{ border: 1, borderColor: open ? FuiColor.item.activeBorderColor : FuiColor.item.borderColor }}
        aria-owns={open ? 'mouse-over-popover' : undefined}
        aria-haspopup="true"
        onMouseEnter={showItemDesc}
        onMouseLeave={closeItemDesc}
        onClick={onClick}
      >
        <Avatar
          src={item.media}
          variant="square"
          sx={{ width: FuiSize.item.size, height: FuiSize.item.size, p: 1, bgcolor: FuiColor.item.background }}
        />
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
        <Card sx={{ bgcolor: FuiColor.item.background, minWidth: 200, maxWidth: 300 }}>
          <CardHeader
            avatar={<Avatar src={item.media} variant="square" />}
            title={
              <Typography variant="body2" sx={{ color: colors.common.white }}>
                {item.name}
              </Typography>
            }
            subheader={
              <Stack direction="row" spacing={1}>
                <Avatar src={coinItem.media} sx={{ width: 20, height: 20 }} variant="square" />
                <Typography sx={{ color: FuiColor.gold }}>{item.price}</Typography>
              </Stack>
            }
          />
          <CardContent sx={{ pt: 0 }}>
            {renderPopover?.()}
            <Typography variant="caption" sx={{ color: FuiColor.item.desc }}>
              {item.desc}
            </Typography>
          </CardContent>
        </Card>
      </Popover>
    </Fragment>
  );
};

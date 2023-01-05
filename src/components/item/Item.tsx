import { FC, Fragment, useState } from 'react';
import { Avatar, Box, colors, Popover, Stack, Typography } from '@mui/material';
import { coinItem, Item } from '@FisherCore';

interface FuiItemProps {
  item: Item;
}

const FuiItemWidth = 30;
const FuiItemHeight = 30;

export const FuiItem: FC<FuiItemProps> = ({ item }) => {
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
        sx={{
          p: 1,
          border: 1,
          minWidth: FuiItemWidth,
          minHeight: FuiItemHeight,
        }}
        aria-owns={open ? 'mouse-over-popover' : undefined}
        aria-haspopup="true"
        onMouseEnter={showItemDesc}
        onMouseLeave={closeItemDesc}
      >
        {item.media && (
          <Avatar
            sx={{ width: 30, height: 30 }}
            src={item.media}
            variant="square"
          />
        )}
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
        <Box sx={{ p: 1, bgcolor: colors.grey[800] }}>
          <Stack direction="row" spacing={1}>
            <Avatar src={item.media} variant="square" />
            <Stack>
              <Typography sx={{ color: colors.common.white }}>
                {item.name}
              </Typography>
              <Stack direction="row" spacing={1}>
                <Avatar
                  src={coinItem.media}
                  sx={{ width: 20, height: 20 }}
                  variant="square"
                />
                <Typography sx={{ color: colors.yellow[600] }}>
                  {item.price}
                </Typography>
              </Stack>
            </Stack>
          </Stack>

          <Typography sx={{ color: colors.blueGrey[300] }}>
            {item.desc}
          </Typography>
        </Box>
      </Popover>
    </Fragment>
  );
};

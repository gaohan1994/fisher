import React from 'react';
import { observer } from 'mobx-react';
import { core, Person, PotionHandler } from '@FisherCore';
import { FuiItem, FuiItemDetailPopover } from '../item';
import { Card, CardHeader, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { FuiColor } from '../theme';

interface FuiPotionHandlerProps {
  title?: React.ReactNode;
  subheader?: React.ReactNode;
  potionHandler: PotionHandler;
  person: Person;
}
const FuiPotionHandler: React.FC<FuiPotionHandlerProps> = observer(({ title, subheader, potionHandler, person }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onUsePotion = () => potionHandler.usePotion(person);

  const onClearPotion = () => {
    potionHandler.clearPotion();
    handleClose();
  };

  return (
    <Card>
      <CardHeader
        action={
          <React.Fragment>
            <IconButton aria-label="settings" aria-controls="menu-appbar" aria-haspopup="true" onClick={handleMenu}>
              <MoreVertIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={onClearPotion}>卸下</MenuItem>
            </Menu>
          </React.Fragment>
        }
        title={title || '丹药'}
        subheader={subheader}
      />
      <CardHeader
        sx={{ pt: 0 }}
        avatar={
          potionHandler.hasPotion ? (
            <FuiItem
              showQuantity
              item={potionHandler.potion!.item as any}
              quantity={potionHandler.potion!.quantity}
              popover={FuiItemDetailPopover.None}
              onClick={onUsePotion}
            />
          ) : (
            <FuiItem item={potionHandler.emptyPotion as any} />
          )
        }
        title={`${potionHandler.hasPotion ? potionHandler.potion?.item.name : '空'}`}
        subheader={
          <Typography variant="caption" color={FuiColor.primaryGreen}>
            {`${potionHandler.hasPotion ? potionHandler.potion?.item.desc : '暂无描述'}`}
          </Typography>
        }
      />
    </Card>
  );
});

const FuiMasterHealPotionHandler: React.FC = observer(() => {
  const { master } = core;
  return (
    <FuiPotionHandler
      person={master.person}
      potionHandler={master.healPotionHandler}
      subheader={
        <Typography variant="caption" color={FuiColor.red}>
          攻击时服用丹药会重置攻击进度条
        </Typography>
      }
    />
  );
});

export { FuiPotionHandler, FuiMasterHealPotionHandler };

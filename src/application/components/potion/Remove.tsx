import { FC, Fragment, useState } from 'react';
import { IconButton, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { PotionHandler } from '@FisherCore';

import { PotionManagerMenu } from './Styled';

const RemovePotionText = '卸下';

interface RemoveProps {
  handler: PotionHandler;
}
export const Remove: FC<RemoveProps> = ({ handler }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onClearPotion = () => {
    handler.clearPotion();
    handleClose();
  };

  return (
    <Fragment>
      <IconButton
        aria-haspopup="true"
        aria-label="master-heal-potion-handler"
        aria-controls="master-heal-potion-handler-control"
        onClick={handleMenu}
      >
        <MoreVertIcon />
      </IconButton>
      <PotionManagerMenu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={onClearPotion}>{RemovePotionText}</MenuItem>
      </PotionManagerMenu>
    </Fragment>
  );
};

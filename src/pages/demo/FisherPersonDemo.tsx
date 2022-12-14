import { FC, Fragment, useState } from 'react';
import { observer } from 'mobx-react';
import { Box, Button, Popover, Stack, Typography } from '@mui/material';
import {
  findFisherItemById,
  FisherEquipmentItem,
  FisherEquipmentSlot,
  FisherPersonEquipment,
} from '@FisherCore';
import { DemoLayout } from './DemoLayout';

interface EquipmentProps {
  equipment: FisherPersonEquipment;
}
const Equipment: FC<EquipmentProps> = observer(({ equipment }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);

  return (
    <Fragment>
      <Box
        onMouseEnter={!equipment.isEmpty ? handlePopoverOpen : () => {}}
        onMouseLeave={handlePopoverClose}
        sx={{
          p: 1,
          width: 80,
          height: 80,
          border: 1,
          color: 'success.main',
          bgcolor: 'text.primary',
        }}
      >
        <div>头盔</div>
        <div>
          {equipment.isEmpty
            ? equipment.emptyEquipment.name
            : equipment.equipment.name}
        </div>
      </Box>
      <Popover
        sx={{
          pointerEvents: 'none',
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={handlePopoverClose}
      >
        <Box sx={{ p: 1, color: 'success.main', bgcolor: 'text.primary' }}>
          <Typography>{equipment.equipment.name}</Typography>
          <Typography>部位：{equipment.slot}</Typography>
          {equipment.equipment.desc && (
            <Typography sx={{ color: 'info.main' }}>
              {equipment.equipment.desc}
            </Typography>
          )}
          {equipment.equipment.attributes && (
            <Stack>
              {equipment.equipment.attributes.map(({ key, value }) => (
                <Typography key={key} sx={{ color: 'error.main' }}>
                  {key}：{value}
                </Typography>
              ))}
            </Stack>
          )}
        </Box>
      </Popover>
    </Fragment>
  );
});

export const FisherPersonDemo: FC = observer(() => {
  const [] = useState(false);

  const { master } = fisher;
  const { Helmet, useEquipment } = master;

  return (
    <DemoLayout title="玩家模块">
      <div>玩家装备</div>
      <Equipment equipment={Helmet} />
      <div>
        <Button
          onClick={() => {
            const helemt =
              findFisherItemById<FisherEquipmentItem>('JadeCloudHairpin');
            useEquipment(FisherEquipmentSlot.Helmet, helemt);
          }}
        >
          带头盔
        </Button>
      </div>
    </DemoLayout>
  );
});

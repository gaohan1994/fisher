import { FC, Fragment, useState } from 'react';
import { observer } from 'mobx-react';
import { Box, Button, Popover, Stack, Typography } from '@mui/material';
import { EquipmentSlot, PersonEquipmentManager } from '@FisherCore';

interface FuiPersonEquipmentProps {
  slot: EquipmentSlot;
  personEquipmentManager: PersonEquipmentManager;
}

export const FuiPersonEquipment: FC<FuiPersonEquipmentProps> = observer(({ personEquipmentManager, slot }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const equipment = personEquipmentManager.equipmentMap.get(slot);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);

  if (equipment === undefined) return <div>loading</div>;

  return (
    <Fragment>
      <Box
        onMouseEnter={!equipment.isEmpty ? handlePopoverOpen : () => {}}
        onMouseLeave={handlePopoverClose}
        sx={{
          p: 1,
          height: 80,
          width: 80,
          border: 1,
          color: 'success.main',
          bgcolor: 'text.primary',
        }}
      >
        <Typography>部位：{equipment.slot}</Typography>
        <Typography>{equipment.isEmpty ? equipment.emptyEquipment.name : equipment.equipment.name}</Typography>
        {!equipment.isEmpty && <Button onClick={() => personEquipmentManager.removeEquipment(slot)}>卸下装备</Button>}
      </Box>
      <Popover
        sx={{ pointerEvents: 'none' }}
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
          {equipment.equipment.desc && <Typography sx={{ color: 'info.main' }}>{equipment.equipment.desc}</Typography>}
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

import { FC, Fragment, useCallback, useState } from 'react';
import { observer } from 'mobx-react';
import { Box, Button, Popover, Stack, Typography } from '@mui/material';
import {
  findFisherItemById,
  FisherEquipmentItem,
  FisherEquipmentSlot,
  FisherPersonEquipment,
  FisherPersonLevel,
  IPersonLevelUpMethods,
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
          height: 80,
          border: 1,
          color: 'success.main',
          bgcolor: 'text.primary',
        }}
      >
        <Typography>部位：{equipment.slot}</Typography>
        <Typography>
          {equipment.isEmpty
            ? equipment.emptyEquipment.name
            : equipment.equipment.name}
        </Typography>
        {!equipment.isEmpty && (
          <Button onClick={equipment.removeEquipment}>卸下装备</Button>
        )}
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

interface LevelProps {
  personLevel: FisherPersonLevel;
}

const Level: FC<LevelProps> = observer(({ personLevel }) => {
  return (
    <Box>
      <Typography>境界：{personLevel.state}</Typography>
      <Typography>{personLevel.label}</Typography>
      <Button
        onClick={() =>
          personLevel.updateBattleTimes(personLevel.coefficient * 1000)
        }
      >
        提升境界
      </Button>
    </Box>
  );
});

export const FisherPersonDemo: FC = observer(() => {
  const { master } = fisher;
  const { Weapon, Helmet, useEquipment, attributePanel, name, personLevel } =
    master;

  const useEquipmentBySlot = useCallback(
    (slot: FisherEquipmentSlot, equipmentId: string) => {
      const equipment = findFisherItemById<FisherEquipmentItem>(equipmentId);
      useEquipment(slot, equipment);
    },
    [findFisherItemById, useEquipment]
  );

  return (
    <DemoLayout title="玩家模块">
      <Typography>属性面板</Typography>
      <Typography>{name}</Typography>
      <Box>
        <Typography>生命值：{attributePanel.MaxHp}</Typography>
        <Typography>攻击：{attributePanel.AttackPower}</Typography>
      </Box>
      <Level personLevel={personLevel} />
      <Equipment equipment={Weapon} />
      <Equipment equipment={Helmet} />
      <div>
        <Button
          onClick={() =>
            useEquipmentBySlot(FisherEquipmentSlot.Weapon, 'WoodSword')
          }
        >
          使用武器
        </Button>
        <Button
          onClick={() =>
            useEquipmentBySlot(FisherEquipmentSlot.Helmet, 'JadeCloudHairpin')
          }
        >
          使用头盔
        </Button>
      </div>
    </DemoLayout>
  );
});

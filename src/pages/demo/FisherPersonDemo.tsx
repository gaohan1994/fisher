import { FC, Fragment, useCallback, useState } from 'react';
import { observer } from 'mobx-react';
import {
  Box,
  Button,
  LinearProgress,
  Popover,
  Stack,
  Typography,
} from '@mui/material';
import {
  findFisherItemById,
  FisherEquipmentItem,
  FisherEquipmentSlot,
  FisherPerson,
  FisherPersonEquipment,
} from '@FisherCore';
import { DemoLayout } from './DemoLayout';
import { PersonLevelManager } from '../../fisher-core/fisher-person/PersonLevelManager';

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
  personLevelManager: PersonLevelManager;
}

const Level: FC<LevelProps> = observer(({ personLevelManager }) => {
  return (
    <Box>
      <Typography>境界：{personLevelManager.state}</Typography>
      <Typography>{personLevelManager.name}</Typography>
    </Box>
  );
});

interface FisherPersonDemoProps {
  person: FisherPerson;
}

export const FisherPersonDemo: FC<FisherPersonDemoProps> = observer(
  ({ person }) => {
    const {
      Weapon,
      Helmet,
      useEquipment,
      attributePanel,
      name,
      personLevelManager,
      Hp,
      actionManager,
    } = person;

    const useEquipmentBySlot = useCallback(
      (slot: FisherEquipmentSlot, equipmentId: string) => {
        const equipment = findFisherItemById<FisherEquipmentItem>(equipmentId);
        useEquipment(slot, equipment);
      },
      [findFisherItemById, useEquipment]
    );

    return (
      <DemoLayout title="玩家模块">
        <Typography>{name}</Typography>
        <Box>
          <Typography>
            生命值 {Hp < 0 ? '0' : Hp} / {attributePanel.MaxHp}
          </Typography>
          <Typography>攻击：{attributePanel.AttackPower}</Typography>
          <Fragment>
            {actionManager.activeDots.map((dot, index) => (
              <Fragment key={`${dot.id}${index}`}>
                <Typography>
                  {dot.name}：每隔{dot.effectiveInterval}造成一次伤害
                </Typography>
              </Fragment>
            ))}
            <LinearProgress
              variant="determinate"
              value={actionManager.attackActionTimer.progress}
            />
          </Fragment>
        </Box>
        <Level personLevelManager={personLevelManager} />
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
  }
);

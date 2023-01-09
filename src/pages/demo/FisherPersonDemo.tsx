import { FC, Fragment, useCallback } from 'react';
import { observer } from 'mobx-react';
import { Box, Button, LinearProgress, Typography } from '@mui/material';
import {
  findItemById,
  findEquipmentSetById,
  EquipmentItem,
  EquipmentSlot,
  Person,
  PersonLevelManager,
} from '@FisherCore';
import { FuiPersonEquipment } from '@Components';
import { DemoLayout } from './DemoLayout';

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
  person: Person;
}

export const FisherPersonDemo: FC<FisherPersonDemoProps> = observer(({ person }) => {
  const { Hp, name, attributePanel, personLevelManager, actionManager, personEquipmentManager } = person;

  const useEquipmentBySlot = useCallback((slot: EquipmentSlot, equipmentId: string) => {
    const equipment = findItemById<EquipmentItem>(equipmentId);
    personEquipmentManager.useEquipment(slot, equipment);
  }, []);

  return (
    <DemoLayout title="玩家模块">
      <Typography>{name}</Typography>
      <Box>
        <Typography>
          生命值 {Hp < 0 ? '0' : Hp} / {attributePanel.MaxHp}
        </Typography>
        <Typography>攻击：{attributePanel.AttackPower}</Typography>
        <Fragment>
          {actionManager.activeDotActions.map((dot, index) => (
            <Fragment key={`${dot.id}${index}`}>
              <Typography>
                次数 {dot.effectiveTimes} / {dot.totalEffectiveTimes}
              </Typography>
              <Typography>
                {dot.name}：每隔{dot.interval}造成{dot.damage()}
                伤害
              </Typography>
            </Fragment>
          ))}
          <LinearProgress variant="determinate" value={actionManager.attackActionTimer.progress} />
        </Fragment>
      </Box>
      <Box>
        {personEquipmentManager.equipmentSets.map((equipmentSet) => {
          return (
            <Box key={equipmentSet.id}>
              {equipmentSet.name}
              {equipmentSet.setAttributes.map(([setSlotControl, setAttributes]) => {
                return (
                  <Box key={setSlotControl.slot}>
                    <Typography>
                      {setSlotControl.slot} 件套 {setSlotControl.active ? '已激活' : '未激活'}{' '}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          );
        })}
      </Box>
      <Level personLevelManager={personLevelManager} />
      <FuiPersonEquipment personEquipmentManager={personEquipmentManager} slot={EquipmentSlot.Weapon} />
      <FuiPersonEquipment personEquipmentManager={personEquipmentManager} slot={EquipmentSlot.Helmet} />
      <div>
        <Button onClick={() => useEquipmentBySlot(EquipmentSlot.Weapon, 'WoodSword')}>使用武器</Button>
        <Button onClick={() => useEquipmentBySlot(EquipmentSlot.Helmet, 'ClothHat')}>使用头盔</Button>
        <Button onClick={() => (person.Hp = 100000)}>debug</Button>
        <Button
          onClick={() => {
            const noobSet = findEquipmentSetById('NoobSet');
            console.log(noobSet);
          }}
        >
          Debug Set
        </Button>
      </div>
    </DemoLayout>
  );
});

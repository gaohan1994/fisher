import { FC, Fragment, useCallback } from 'react';
import { observer } from 'mobx-react';
import { Box, Button, LinearProgress, Typography } from '@mui/material';
import { findItemById, EquipmentItem, EquipmentSlot, Person } from '@FisherCore';
import { FuiPersonEquipment } from '@Components';
import { DemoLayout } from './DemoLayout';
import { PersonLevelManager } from '../../fisher-core/fisher-person/PersonLevelManager';

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
  const { Hp, name, Weapon, Helmet, useEquipment, attributePanel, personLevelManager, actionManager } = person;

  const useEquipmentBySlot = useCallback(
    (slot: EquipmentSlot, equipmentId: string) => {
      const equipment = findItemById<EquipmentItem>(equipmentId);
      useEquipment(slot, equipment);
    },
    [findItemById, useEquipment]
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
      <Level personLevelManager={personLevelManager} />
      <FuiPersonEquipment equipment={Weapon} />
      <FuiPersonEquipment equipment={Helmet} />
      <div>
        <Button onClick={() => useEquipmentBySlot(EquipmentSlot.Weapon, 'WoodSword')}>使用武器</Button>
        <Button onClick={() => useEquipmentBySlot(EquipmentSlot.Helmet, 'JadeCloudHairpin')}>使用头盔</Button>
        <Button onClick={() => (person.Hp = 100000)}>debug</Button>
      </div>
    </DemoLayout>
  );
});

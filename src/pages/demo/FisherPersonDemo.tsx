import { FC, Fragment, useCallback } from 'react';
import { observer } from 'mobx-react';
import { Box, Button, LinearProgress, Typography } from '@mui/material';
import {
  findFisherItemById,
  FisherEquipmentItem,
  FisherEquipmentSlot,
  FisherPerson,
} from '@FisherCore';
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
  person: FisherPerson;
}

export const FisherPersonDemo: FC<FisherPersonDemoProps> = observer(
  ({ person }) => {
    const {
      Hp,
      name,
      Weapon,
      Helmet,
      useEquipment,
      attributePanel,
      personLevelManager,
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
                  次数 {dot.effectiveTimes} / {dot.totalEffectiveTimes}
                </Typography>
                <Typography>{!dot.isFinished ? '生效中' : '已结束'}</Typography>
                <Typography>
                  {dot.name}：每隔{dot.effectiveInterval}造成{dot.damage()}
                  伤害
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
        <FuiPersonEquipment equipment={Weapon} />
        <FuiPersonEquipment equipment={Helmet} />
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
          <Button onClick={() => (person.Hp = 100000)}>debug</Button>
        </div>
      </DemoLayout>
    );
  }
);

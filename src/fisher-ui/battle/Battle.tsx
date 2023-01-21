import { FC } from 'react';
import { observer } from 'mobx-react';
import { IconButton, Tooltip, Typography, CircularProgress, LinearProgress, Stack, Avatar } from '@mui/material';
import { core, store, Person } from '@FisherCore';
import { BaseDotAction } from '../../fisher-core/fisher-actions';
import Button from '@mui/material/Button';

interface FuiBattleDotsProps {
  dots: BaseDotAction[];
}

const FuiBattleDots: FC<FuiBattleDotsProps> = ({ dots }) => {
  return (
    <Stack direction="row">
      {dots.map((dot, index) => (
        <Tooltip key={`${dot.id}${index}`} title={`${dot.name}: ${dot.effectiveTimes}/${dot.totalEffectiveTimes}`}>
          <IconButton>
            <Avatar src={dot.media} sx={{ width: 30, height: 30 }} />
          </IconButton>
        </Tooltip>
      ))}
    </Stack>
  );
};

interface BattleDescProps {
  person: Person;
}

const FuiBattleInfo: FC<BattleDescProps> = observer(({ person }) => {
  const { actionManager, Hp } = person;

  const normalise = (value: number) => (value * 100) / person.attributePanel.MaxHp;
  return (
    <Stack spacing={1}>
      <Typography>
        {Hp} / {person.attributePanel.MaxHp}
      </Typography>
      <LinearProgress color="error" sx={{ width: 200 }} variant="determinate" value={normalise(Hp)} />
      <LinearProgress sx={{ width: 200 }} variant="determinate" value={actionManager.attackActionTimer.progress} />
      {actionManager.activeDotActions && <FuiBattleDots dots={actionManager.activeDotActions} />}

      <Button
        onClick={() => {
          const weapon = store.findEquipmentById('WoodSword');
          person.personEquipmentManager.useEquipment(weapon);
        }}
      >
        Weapon
      </Button>
    </Stack>
  );
});

const FuiBattle: FC = observer(() => {
  const { battle } = core;
  return (
    <Stack direction="row" spacing={1}>
      <Stack direction="row" spacing={1}>
        <Avatar src={battle.master.media} />
        <FuiBattleInfo person={battle.master.person} />
      </Stack>

      {battle.isInitial ? (
        battle.enemy && (
          <Stack direction="row" spacing={1}>
            <FuiBattleInfo person={battle.enemy!.person} />
            <Avatar src={battle.enemy.media} />
          </Stack>
        )
      ) : battle.isEnemyLoading ? (
        <CircularProgress />
      ) : (
        <Stack direction="row" spacing={1}>
          <FuiBattleInfo person={battle.enemy!.person} />
          <Avatar src={battle.enemy?.media} />
        </Stack>
      )}
    </Stack>
  );
});

export { FuiBattle };

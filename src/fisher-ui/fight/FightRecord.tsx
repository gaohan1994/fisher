import { FC } from 'react';
import { Enemy, FisherAction, FisherActions, Master } from '@FisherCore';
import { Typography, TypographyProps } from '@mui/material';
import { FuiItemName } from '../item';
import { FuiColor } from '../theme';

const RecordContainer: FC<TypographyProps> = ({ sx, children, ...rest }) => (
  <Typography variant="caption" component="div" sx={{ position: 'relative', ...(sx ?? {}) }} {...(rest as any)}>
    {children}
  </Typography>
);

interface IRecordTime {
  time: string;
}
const RecordTime: FC<IRecordTime> = ({ time }) => (
  <Typography variant="caption" color="gray" sx={{ position: 'absolute', right: 10 }}>
    {time}
  </Typography>
);

interface IFightEndRecord {
  enemy: Enemy;
  time: string;
}
const FightVictoryRecord: FC<IFightEndRecord> = ({ enemy, time }) => (
  <RecordContainer color={FuiColor.primaryGreen}>
    {'战斗胜利，您打败了 '}
    <FuiItemName item={enemy.enemyItem} />
    <RecordTime time={time} />
  </RecordContainer>
);

interface IFightEndRecord {
  enemy: Enemy;
  time: string;
}
const FightLostRecord: FC<IFightEndRecord> = ({ enemy, time }) => (
  <RecordContainer color={FuiColor.red}>
    {'战斗失败，您被 '}
    <FuiItemName item={enemy.enemyItem} />
    {' 打败了'}
    <RecordTime time={time} />
  </RecordContainer>
);

interface IFightPersonHurtRecord {
  player: Master | Enemy;
  value: number;
  time: string;
}
const FightPersonHurtRecord: FC<IFightPersonHurtRecord> = ({ player, value, time }) => (
  <RecordContainer>
    {`${player.person.isMaster ? '您' : player.name} 受到了 `}
    <Typography color={FuiColor.red} variant="caption">
      {value}
    </Typography>
    {' 点伤害'}
    <RecordTime time={time} />
  </RecordContainer>
);

interface IFightPersonHealRecord {
  player: Master | Enemy;
  value: number;
  time: string;
}
const FightPersonHealRecord: FC<IFightPersonHealRecord> = ({ player, value, time }) => (
  <RecordContainer>
    {`${player.person.isMaster ? '您' : player.name} 恢复了 `}
    <Typography color={FuiColor.primaryGreen} variant="caption">
      {value}
    </Typography>
    {' 点生命值'}
    <RecordTime time={time} />
  </RecordContainer>
);

interface IFightPersonActionRecord {
  player: Master | Enemy;
  action: FisherAction;
  time: string;
}
const FightPersonActionRecord: FC<IFightPersonActionRecord> = ({ player, action, time }) => (
  <RecordContainer>
    {`${player.person.isMaster ? '您' : player.name} 使用了 `}
    <Typography variant="caption" color={FuiColor.primaryGreen}>
      {action.name}
    </Typography>
    {` ${action.desc}`}
    <RecordTime time={time} />
  </RecordContainer>
);

export { FightVictoryRecord, FightLostRecord, FightPersonHurtRecord, FightPersonHealRecord, FightPersonActionRecord };

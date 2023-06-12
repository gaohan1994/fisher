import { useEffect } from 'react';
import { ActionManager, Fight, Person } from '@FisherCore';
import { useArray } from '../../application/hook/UseArray';
import {
  FightLostRecord,
  FightPersonActionRecord,
  FightPersonHealRecord,
  FightPersonHurtRecord,
  FightVictoryRecord,
} from './FightRecord';

const useFightRecords = (fight: Fight) => {
  const { value: records, push, clear } = useArray<React.ReactNode>();
  const {
    info: { master, enemy },
  } = fight;

  useEffect(() => {
    const disposers = [
      master.actionManager.event.on(ActionManager.ActionManagerEventKeys.ExecuteAction, ({ action, time }) =>
        push(
          <FightPersonActionRecord
            key={`${master.displayName}:${time}:${Math.random()}`}
            player={master}
            action={action}
            time={time}
          />
        )
      ),
      enemy.actionManager.event.on(ActionManager.ActionManagerEventKeys.ExecuteAction, ({ action, time }) =>
        push(
          <FightPersonActionRecord
            key={`${enemy.key}:${time}:${Math.random()}`}
            player={enemy}
            action={action}
            time={time}
          />
        )
      ),
      fight.event.on(Fight.EventKeys.MasterWinFight, (_master, _enemy, _time) =>
        push(<FightVictoryRecord key={_enemy.key} enemy={_enemy} time={_time} />)
      ),
      fight.event.on(Fight.EventKeys.MasterLostFight, (_master, _enemy, _time) =>
        push(<FightLostRecord key={_enemy.key} enemy={_enemy} time={_time} />)
      ),
      master.person.event.on(Person.PersonEventKeys.Hurt, ({ value, time }) =>
        push(
          <FightPersonHurtRecord
            key={`${master.displayName}:${value}:${time}:${Math.random()}`}
            player={master}
            time={time}
            value={value}
          />
        )
      ),
      enemy.person.event.on(Person.PersonEventKeys.Hurt, ({ value, time }) =>
        push(
          <FightPersonHurtRecord
            key={`${enemy.key}:${value}:${time}:${Math.random()}`}
            player={enemy}
            time={time}
            value={value}
          />
        )
      ),
      master.person.event.on(Person.PersonEventKeys.Heal, ({ value, time }) =>
        push(
          <FightPersonHealRecord
            key={`${master.displayName}:${value}:${time}:${Math.random()}`}
            player={master}
            time={time}
            value={value}
          />
        )
      ),
      enemy.person.event.on(Person.PersonEventKeys.Heal, ({ value, time }) =>
        push(
          <FightPersonHealRecord
            key={`${enemy.key}:${value}:${time}:${Math.random()}`}
            player={enemy}
            time={time}
            value={value}
          />
        )
      ),
    ];

    return () => disposers.forEach((disposer) => disposer());
  }, [fight]);

  return {
    records,
    clear,
  };
};

export { useFightRecords };

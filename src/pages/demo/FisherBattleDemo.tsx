import React from 'react';
import { Button, Stack, Typography } from '@mui/material';
import { DemoLayout } from './DemoLayout';
import { FisherBattle } from '../../fisher-core/fisher-battle';
import { FisherPerson } from '../../fisher-core/fisher-person';
import { FisherPersonDemo } from './FisherPersonDemo';
import { observer } from 'mobx-react';

export const FisherBattleDemo = observer(
  class FisherBattleDemo extends React.Component<any, any> {
    constructor(props: any) {
      super(props);
      this.state = {
        battle: new FisherBattle(),
        enemy: undefined,
      };
    }

    public initializeBattle = () => {
      const enemy = new FisherPerson();
      enemy.initialize({
        name: '任我行',
        mode: FisherPerson.Mode.Enemy,
        level: FisherPerson.Level.GasRefiningMiddle,
      });
      this.setState({
        enemy: enemy,
      });
      this.state.battle.initialize({ master: fisher.master, enemy });
    };

    render() {
      const { battle, enemy } = this.state;
      return (
        <DemoLayout title="战斗模块">
          <Typography>{battle.inBattle ? '战斗中' : '等待战斗'}</Typography>
          <Button onClick={this.initializeBattle}>设置敌人</Button>
          {battle.inBattle ? (
            <Button onClick={() => battle.stop()}>停止战斗</Button>
          ) : (
            <Button onClick={() => battle.start()}>开始战斗</Button>
          )}
          <Stack direction="row">
            <FisherPersonDemo person={fisher.master} />
            {enemy && <FisherPersonDemo person={enemy} />}
          </Stack>
        </DemoLayout>
      );
    }
  }
);

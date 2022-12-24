import React from 'react';
import { observer } from 'mobx-react';
import { Button, Stack, Typography } from '@mui/material';
import { DemoLayout } from './DemoLayout';
import { FisherPersonDemo } from './FisherPersonDemo';
import { Enemy, FisherPerson } from '@FisherCore';
import { FisherBattle } from '../../fisher-core/fisher-battle';

export const FisherBattleDemo = observer(
  class FisherBattleDemo extends React.Component<any, any> {
    constructor(props: any) {
      super(props);
      this.state = {
        battle: new FisherBattle(),
      };
    }

    public initializeBattle = () => {
      const enemy = new Enemy();
      enemy.initialize({
        name: '任我行',
        level: FisherPerson.Level.GasRefiningMiddle,
      });
      this.state.battle.initialize({ enemy });
    };

    render() {
      const { battle } = this.state;
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
            {battle.enemy && <FisherPersonDemo person={battle.enemy} />}
          </Stack>
        </DemoLayout>
      );
    }
  }
);

import React, { Fragment } from 'react';
import { observer } from 'mobx-react';
import { Box, Button, Stack, Typography } from '@mui/material';
import { DemoLayout } from './DemoLayout';
import { FisherPersonDemo } from './FisherPersonDemo';
import { FisherBattle } from '../../fisher-core/fisher-battle';

export const FisherBattleDemo = observer(
  class FisherBattleDemo extends React.Component<
    any,
    { battle: FisherBattle }
  > {
    constructor(props: any) {
      super(props);
      const battle = new FisherBattle();
      this.state = {
        battle,
      };
      (window as any).battle = battle;
    }

    render() {
      const { battle } = this.state;
      return (
        <DemoLayout title="战斗模块">
          <Typography>{battle.inBattle ? '战斗中' : '等待战斗'}</Typography>
          <Stack direction="row">
            <Box>
              {battle.packages.map((area) => (
                <Box key={area.id}>
                  <Typography>{area.name}</Typography>
                  {area.enemies.map((enemy) => (
                    <Box
                      key={`${area.id}${enemy.id}`}
                      border={1}
                      mb={1}
                      onClick={() => battle.start(enemy)}
                    >
                      <Typography>{enemy.name}</Typography>
                      <Typography>{enemy.level}</Typography>
                    </Box>
                  ))}
                </Box>
              ))}
              {battle.inBattle && (
                <Button onClick={() => battle.stop()}>停止战斗</Button>
              )}
            </Box>
            <Box>
              <Stack direction="row">
                <FisherPersonDemo person={fisher.master} />
                {battle.enemy && <FisherPersonDemo person={battle.enemy} />}
              </Stack>
            </Box>
            <Box>
              <Typography>战利品</Typography>
              {battle.rewardPool.length > 0 ? (
                battle.rewardPool.map((reward, index) => (
                  <Fragment key={index}>
                    {reward.hasRewardGold && (
                      <Box>Gold: {reward.rewardGold}</Box>
                    )}
                    {reward.hasRewardItems &&
                      reward.rewardItems.map(([item, quantity]) => (
                        <Box key={`${index}${item.id}`}>
                          {item.name} x {quantity}
                        </Box>
                      ))}
                  </Fragment>
                ))
              ) : (
                <Typography>空</Typography>
              )}
            </Box>
          </Stack>
        </DemoLayout>
      );
    }
  }
);

import { Fragment, useEffect } from 'react';
import { observer } from 'mobx-react';
import { Box, Button, Stack, Typography } from '@mui/material';
import { DemoLayout } from './DemoLayout';
import { core } from '@FisherCore';
import { FuiItem, FuiBattle } from '@Fui';

export const FisherBattleDemo = observer(() => {
  const { battle } = core;

  useEffect(() => {
    (window as any).battle = core.battle;
  }, []);

  return (
    <DemoLayout title="战斗模块">
      <Typography>{battle.isFighting ? '战斗中' : '等待战斗'}</Typography>
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
                  onClick={async () => {
                    await battle.setEnemyItem(enemy);
                    battle.start();
                  }}
                >
                  <Typography>{enemy.name}</Typography>
                  <Typography>{enemy.level}</Typography>
                </Box>
              ))}
            </Box>
          ))}
          {battle.isFighting && <Button onClick={() => battle.stop()}>停止战斗</Button>}
        </Box>
        {/* <Box>
              <Stack direction="row">
                <FisherPersonDemo person={core.master} />
                {battle.enemy && <FisherPersonDemo person={battle.enemy} />}
              </Stack>
            </Box> */}
        <Box>
          <Typography>战利品</Typography>
          {battle.rewardPool.pool.length > 0 ? (
            battle.rewardPool.pool.map((reward, index) => (
              <Fragment key={index}>
                {reward.hasRewardGold && <Box>Gold: {reward.rewardGold}</Box>}
                {reward.hasRewardItems &&
                  reward.rewardItems.map(([item, quantity], index) => (
                    <FuiItem key={`${item.id}${index}`} item={item} />
                  ))}
              </Fragment>
            ))
          ) : (
            <Typography>空</Typography>
          )}
        </Box>
      </Stack>
      <FuiBattle />
    </DemoLayout>
  );
});

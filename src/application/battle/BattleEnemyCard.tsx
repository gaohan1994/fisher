import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { Avatar, Card, CardHeader, IconButton, Tooltip, Typography } from '@mui/material';
import { Assets, EnemyItem, core } from '@FisherCore';
import { FuiEnemyRewardPreview } from '@Fui';
import { useBattleEnemyItemRewards, useIsActiveBattleEnemyItem } from './BattleHook';

const BattleEnemyActiveTag = () => (
  <Typography variant="caption" color="secondary" sx={{ ml: 1 }}>
    选中的目标
  </Typography>
);

interface IBattleEnemyCard {
  enemyItem: EnemyItem;
  onSelectEnemyItem?: (enemyItem: EnemyItem) => void;
}
const BattleEnemyCard: FC<IBattleEnemyCard> = observer(({ enemyItem, onSelectEnemyItem }) => {
  const isActiveBattleEnemyItem = useIsActiveBattleEnemyItem(enemyItem);
  const { rewardItems, randomRewardItems } = useBattleEnemyItemRewards(enemyItem);

  const onStartBattleEnemyItem = React.useCallback(() => {
    core.battle.setAcitveEnemyItem(enemyItem);
    core.battle.start();
    onSelectEnemyItem?.(enemyItem);
  }, []);

  return (
    <Card elevation={20}>
      <CardHeader
        subheader={enemyItem.desc}
        avatar={<Avatar src={enemyItem.media} />}
        title={
          <React.Fragment>
            {enemyItem.name}
            {isActiveBattleEnemyItem && <BattleEnemyActiveTag />}
          </React.Fragment>
        }
        action={
          <React.Fragment>
            <Tooltip title="战斗">
              <IconButton onClick={onStartBattleEnemyItem}>
                <Avatar src={Assets.attack} variant="square" sx={{ width: 30, height: 30 }} />
              </IconButton>
            </Tooltip>
            <FuiEnemyRewardPreview rewardItems={rewardItems} randomRewardItems={randomRewardItems} />
          </React.Fragment>
        }
      />
    </Card>
  );
});

export { BattleEnemyCard };

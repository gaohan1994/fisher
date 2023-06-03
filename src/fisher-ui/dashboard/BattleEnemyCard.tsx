import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { Avatar, Card, CardContent, CardHeader, IconButton, Tooltip, Typography } from '@mui/material';
import { Assets, EnemyItem, core } from '@FisherCore';
import { FuiItemName } from '../item';
import { FuiActiveText } from '../text';
import { PersonModeText } from '../person';
import { FuiEnemyRewardPreview } from '../reward';
import { FuiLevelInfo } from '../experience';
import { useBattleEnemyItemRewards, useIsActiveBattleEnemyItem } from './BattleHook';

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
        avatar={<Avatar src={enemyItem.media} />}
        title={
          <Typography>
            <FuiItemName item={enemyItem} />
            {isActiveBattleEnemyItem && <FuiActiveText sx={{ ml: 1 }} text="选中的目标" circleProgress={false} />}
          </Typography>
        }
        subheader={
          <React.Fragment>
            <PersonModeText mode={enemyItem.mode as any} />
            <FuiLevelInfo level={enemyItem.level} sx={{ ml: 1 }} />
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
      <CardContent sx={{ pt: 0 }}>
        <Typography variant="caption">{enemyItem.desc}</Typography>
      </CardContent>
    </Card>
  );
});

export { BattleEnemyCard };

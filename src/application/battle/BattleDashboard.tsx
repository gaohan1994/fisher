import React from 'react';
import { observer } from 'mobx-react';
import { EnemyItem, core } from '@FisherCore';
import { ExpandMore, FuiBaseDashboard, FuiEnemyRewardPreview } from '@Fui';
import { Box, Button, Collapse, Typography } from '@mui/material';
import { BattleEnemySelector } from './BattleEnemySelector';
import { useBattleEnemyItemRewards } from './BattleHook';

const BattleDashboard = observer(() => {
  const { battle } = core;
  const { activeEnemyItem } = battle;
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const onSelectEnemyItem = () => {
    setExpanded(false);
  };

  return (
    <FuiBaseDashboard
      fisherComponent={battle}
      action={
        <Button
          sx={{ mr: 1 }}
          variant="contained"
          color="warning"
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          {expanded ? '收起列表' : '选择目标'}
          <ExpandMore expand={expanded} />
        </Button>
      }
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        {activeEnemyItem === undefined && (
          <Typography variant="body2" sx={{ mb: 2 }}>
            当前暂无挑战的目标
          </Typography>
        )}
        {activeEnemyItem && <ActiveBattleEnemyInfo activeEnemy={activeEnemyItem} />}
      </Box>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <BattleEnemySelector onSelectEnemyItem={onSelectEnemyItem} />
      </Collapse>
    </FuiBaseDashboard>
  );
});

interface IActiveBattleEnemyInfo {
  activeEnemy: EnemyItem;
}
const ActiveBattleEnemyInfo: React.FC<IActiveBattleEnemyInfo> = ({ activeEnemy }) => {
  const { rewardItems, randomRewardItems } = useBattleEnemyItemRewards(activeEnemy);
  return (
    <React.Fragment>
      <Typography variant="body1" color="secondary" sx={{ mb: 1 }}>
        战斗目标：{activeEnemy.name}
      </Typography>
      <FuiEnemyRewardPreview rewardItems={rewardItems} randomRewardItems={randomRewardItems} />
    </React.Fragment>
  );
};

export { BattleDashboard };

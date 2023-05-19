import React from 'react';
import { observer } from 'mobx-react';
import { Stack, Card, CardHeader, CardContent, Typography, Button } from '@mui/material';
import { RewardPool } from '@FisherCore';
import { FuiColor } from '../theme';
import { FuiCardTitle } from '../container';
import { FuiExperienceItem, FuiGoldItem, FuiItemDetailPopover, FuiItemRender } from '../item';

interface IFuiRewardPool {
  rewardPool: RewardPool;
  onExecuteRewardPoolCallback?: () => void;
}
const FuiRewardPool: React.FC<IFuiRewardPool> = observer(({ rewardPool, onExecuteRewardPoolCallback }) => {
  const onClickExecuteReward = () => {
    rewardPool.executeRewardPool();
    onExecuteRewardPoolCallback?.();
  };

  return (
    <Card sx={{ bgcolor: FuiColor.primary.background }}>
      <CardHeader
        sx={{ p: 2 }}
        title={<FuiCardTitle value="战利品" />}
        action={
          <Button variant="contained" color="success" onClick={onClickExecuteReward}>
            全部拾取
          </Button>
        }
      />
      <CardContent sx={{ p: 2 }}>
        <Stack direction="row" style={{ flexWrap: 'wrap', maxHeight: '40vh', overflow: 'auto' }}>
          {!rewardPool.hasReward && <Typography>暂无战利品</Typography>}
          {rewardPool.hasReward && (
            <React.Fragment>
              {rewardPool.pool.map((reward, index) => (
                <React.Fragment key={index}>
                  {reward.hasRewardGold && <FuiGoldItem gold={reward.rewardGold} />}
                  {reward.hasRewardExperience && (
                    <React.Fragment>
                      {reward.rewardExperience.map(([componentId, experience], index) => (
                        <FuiExperienceItem
                          key={`${componentId}-${index}`}
                          componentId={componentId}
                          experience={experience}
                        />
                      ))}
                    </React.Fragment>
                  )}
                  {reward.hasRewardItems && (
                    <React.Fragment>
                      {reward.rewardItems.map(([item, quantity], index) => (
                        <FuiItemRender
                          key={`${item.id}-${quantity}-${index}`}
                          popover={FuiItemDetailPopover.MouseOver}
                          item={item}
                          quantity={quantity}
                        />
                      ))}
                    </React.Fragment>
                  )}
                </React.Fragment>
              ))}
            </React.Fragment>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
});

export { FuiRewardPool };

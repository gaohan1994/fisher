import React from 'react';
import { observer } from 'mobx-react';
import { Stack, Card, CardHeader, CardContent, Typography, Button } from '@mui/material';
import { core } from '@FisherCore';
import { FuiItemRender, FuiColor, FuiExperienceItem, FuiGoldItem, FuiItemDetailPopover, FuiCardTitle } from '@Fui';

const BattleRewards: React.FC = observer(() => {
  const { battle } = core;

  return (
    <Card sx={{ bgcolor: FuiColor.primary.background }}>
      <CardHeader
        sx={{ p: 2 }}
        title={<FuiCardTitle value="战利品" />}
        action={
          <Button variant="contained" color="success" onClick={battle.executeRewards}>
            全部拾取
          </Button>
        }
      />
      <CardContent sx={{ p: 2 }}>
        <Stack direction="row" style={{ flexWrap: 'wrap', maxHeight: '40vh', overflow: 'auto' }}>
          {!battle.rewardPool.hasReward && <Typography>暂无战利品</Typography>}
          {battle.rewardPool.hasReward && (
            <React.Fragment>
              {battle.rewardPool.pool.map((reward, index) => (
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

export { BattleRewards };

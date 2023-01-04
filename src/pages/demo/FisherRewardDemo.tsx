import { FC } from 'react';
import { observer } from 'mobx-react';
import { DemoLayout } from './DemoLayout';
import { Button, Stack } from '@mui/material';
import { NormalItem, Reward } from '@FisherCore';
import { createTestBackpackItemPayload } from './FisherBackpackDemo';
import { makeAutoObservable } from 'mobx';

const testFisherItem = new NormalItem(createTestBackpackItemPayload(''));
const fisherReward = makeAutoObservable(new Reward());

export const FisherRewardDemo: FC = observer(() => {
  return (
    <DemoLayout title="FisherRewardDemo">
      <div>reward gold: {fisherReward.rewardGold}</div>
      <div>
        reward items:
        {fisherReward.rewardItemMap.size > 0
          ? fisherReward.rewardItems.map(([item, quantity]) => (
              <li key={item.id}>
                {item.name} x {quantity}
              </li>
            ))
          : 'empty'}
      </div>
      <Stack direction="row" spacing={1}>
        <Button onClick={() => fisherReward.addRewardGold(50)}>
          add reward gold 50
        </Button>
        <Button onClick={() => fisherReward.addRewardItem(testFisherItem, 1)}>
          add one reward item
        </Button>
      </Stack>
      <Button
        fullWidth={true}
        variant="contained"
        onClick={() => fisherReward.executeRewards()}
      >
        execute reward
      </Button>
    </DemoLayout>
  );
});

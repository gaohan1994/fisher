import { FC } from 'react';
import { observer } from 'mobx-react';
import { DemoLayout } from './DemoLayout';
import { Button, Stack } from '@mui/material';
import { NormalItem, Reward } from '@FisherCore';
import { createTestBackpackItemPayload } from './FisherBackpackDemo';
import { makeAutoObservable } from 'mobx';

const testFisherItem = new NormalItem(createTestBackpackItemPayload(''));
const reward = makeAutoObservable(new Reward());

export const FisherRewardDemo: FC = observer(() => {
  return (
    <DemoLayout title="FisherRewardDemo">
      <div>reward gold: {reward.rewardGold}</div>
      <div>
        reward items:
        {reward.rewardItemMap.size > 0
          ? reward.rewardItems.map(([item, quantity]) => (
              <li key={item.id}>
                {item.name} x {quantity}
              </li>
            ))
          : 'empty'}
      </div>
      <Stack direction="row" spacing={1}>
        <Button onClick={() => reward.addRewardGold(50)}>
          add reward gold 50
        </Button>
        <Button onClick={() => reward.addRewardItem(testFisherItem, 1)}>
          add one reward item
        </Button>
      </Stack>
      <Button
        fullWidth={true}
        variant="contained"
        onClick={() => reward.executeRewards()}
      >
        execute reward
      </Button>
    </DemoLayout>
  );
});

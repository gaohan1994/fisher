import { FC, ReactNode, useState } from 'react';
import { observer } from 'mobx-react';
import { DemoLayout } from './DemoLayout';
import { Button, Stack } from '@mui/material';
import { FisherItem, FisherReward } from '@FisherCore';
import { createTestBackpackItemPayload } from './FisherBackpackDemo';

const testFisherItem = new FisherItem(createTestBackpackItemPayload(''));

export const FisherRewardDemo: FC = observer(() => {
  const [fisherReward] = useState(() => new FisherReward());

  const fisherRewardItemsList = () => {
    const result: ReactNode[] = [];
    fisherReward.rewardItems.forEach((quantity, fisherItem) => {
      result.push(
        <li key={fisherItem.id}>
          {fisherItem.name} x {quantity}
        </li>
      );
    });
    return result;
  };

  return (
    <DemoLayout title="FisherRewardDemo">
      <div>reward gold: {fisherReward.rewardGold}</div>
      <div>
        reward items:
        {fisherReward.rewardItems.size > 0 ? fisherRewardItemsList() : 'empty'}
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

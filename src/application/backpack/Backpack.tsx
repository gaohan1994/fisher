import { FuiContainer, FuiCoin, FuiCardTitle } from '@Fui';

import { useBank } from '../core';
import { GridContainer, GridLeft, GridRight, ModuleCard, StackSpaceBetween } from '../components';

import { BackpackTabs } from './BackpackTabs';
import { FuiBackpackItemControl } from './BackpackItemControl';

export const PageBackpack = () => (
  <FuiContainer>
    <GridContainer>
      <GridLeft>
        <ModuleCard title={<BackpackCardTitle />}>
          <BackpackTabs />
        </ModuleCard>
      </GridLeft>
      <GridRight>
        <FuiBackpackItemControl />
      </GridRight>
    </GridContainer>
  </FuiContainer>
);

const BackpackCardTitle = () => {
  const bank = useBank();
  return (
    <StackSpaceBetween>
      <FuiCardTitle value="背包" />
      <FuiCoin price={bank.gold} />
    </StackSpaceBetween>
  );
};

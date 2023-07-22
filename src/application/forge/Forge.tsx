import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { Grid } from '@mui/material';
import { FuiContainer, FuiDashboard } from '@Fui';

import { useForge } from '../core';
import { Station } from '../components';
import { useForgeCategoies } from './Hook';
import { ForgeTabCategories } from './Constants';
import { TabPanel } from './Styled';
import { ForgeTabs } from './ForgeTabs';
import { ForgeAccordionRecipes } from './ForgeAccordionRecipes';

const PageForge: React.FC = observer(() => {
  const forge = useForge();
  const [activeCategory, setActiveCategory] = useState(ForgeTabCategories.EquipmentSet);
  const categories = useForgeCategoies();
  return (
    <FuiContainer>
      <FuiDashboard fisherComponent={forge} />
      <Grid container spacing={2}>
        <Grid container item xs>
          <Grid item xs={12} sx={{ mb: 2 }}>
            <ForgeTabs activeTab={activeCategory} onChangeTab={setActiveCategory} />
          </Grid>
          {categories.map(({ category: { key }, data }) => (
            <TabPanel key={key} index={key} value={activeCategory}>
              {data.map(({ summary, recipes }) => (
                <ForgeAccordionRecipes key={`${key}-${summary}`} summary={summary} recipes={recipes} />
              ))}
            </TabPanel>
          ))}
        </Grid>
        <Grid item xs={4}>
          <Station component={forge} />
        </Grid>
      </Grid>
    </FuiContainer>
  );
});

export { PageForge };

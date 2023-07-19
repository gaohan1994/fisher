import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { Grid } from '@mui/material';
import { EquipmentSlotName, RarityName } from '@FisherCore';
import { FuiContainer, FuiDashboard } from '@Fui';

import { useForge } from '../core';
import { Station } from '../components';
import { ForgeStore } from './ForgeStore';
import { ForgeTabCategories } from './Constants';
import { ForgeRecipeTabs, TabPanel } from './ForgeRecipeTabs';
import { ForgeAccordionRecipes } from './ForgeAccordionRecipes';

const PageForge: React.FC = observer(() => {
  const forge = useForge();
  const { ForgeRarityRecipes, ForgeSlotCategoryRecipes } = forge;

  const [forgeStore] = useState(new ForgeStore(forge));
  const { activeRecipeTab, recipeTabs, onChangeRecipeTab, equipmentSetCategoryRecipes } = forgeStore;

  return (
    <FuiContainer>
      <FuiDashboard fisherComponent={forge} />
      <Grid container spacing={2}>
        <Grid container item xs>
          <Grid item xs={12} sx={{ mb: 2 }}>
            <ForgeRecipeTabs tabs={recipeTabs} activeTab={activeRecipeTab} onChangeTab={onChangeRecipeTab} />
          </Grid>
          <TabPanel index={ForgeTabCategories.EquipmentSet} value={activeRecipeTab}>
            {equipmentSetCategoryRecipes.map(([equipmentSet, recipes]) => (
              <ForgeAccordionRecipes key={equipmentSet.id} summary={equipmentSet.name} recipes={recipes} />
            ))}
          </TabPanel>
          <TabPanel index={ForgeTabCategories.Rarity} value={activeRecipeTab}>
            {ForgeRarityRecipes.map(([rarity, recipes]) => (
              <ForgeAccordionRecipes key={rarity} summary={RarityName[rarity]} recipes={recipes} />
            ))}
          </TabPanel>
          <TabPanel index={ForgeTabCategories.Slot} value={activeRecipeTab}>
            {ForgeSlotCategoryRecipes.map(([equipmentSlot, recipes]) => (
              <ForgeAccordionRecipes key={equipmentSlot} summary={EquipmentSlotName[equipmentSlot]} recipes={recipes} />
            ))}
          </TabPanel>
        </Grid>
        <Grid item xs={4}>
          <Station component={forge} />
        </Grid>
      </Grid>
    </FuiContainer>
  );
});

export { PageForge };

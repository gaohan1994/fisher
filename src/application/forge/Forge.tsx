import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { Grid } from '@mui/material';
import { EquipmentSlotName, RarityName, core } from '@FisherCore';
import { ForgeRecipeCard, FuiContainer, FuiDashboard, FuiRecipeTable, RecipeCardGrid } from '@Fui';
import { ForgeRecipeTabs, TabPanel } from './ForgeRecipeTabs';
import { ForgeStore } from './ForgeStore';
import { ForgeTabCategories } from './Constants';
import { ForgeAccordionRecipes } from './ForgeAccordionRecipes';

const PageForge: React.FC = observer(() => {
  const { forge } = core;
  const { packages, ForgeRarityRecipes, ForgeSlotCategoryRecipes } = forge;

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
          <TabPanel index={ForgeTabCategories.All} value={activeRecipeTab}>
            <Grid container spacing={2}>
              {packages.map((item) => (
                <RecipeCardGrid xs={6} key={item.id}>
                  <ForgeRecipeCard recipe={item} />
                </RecipeCardGrid>
              ))}
            </Grid>
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
          <TabPanel index={ForgeTabCategories.EquipmentSet} value={activeRecipeTab}>
            {equipmentSetCategoryRecipes.map(([equipmentSet, recipes]) => (
              <ForgeAccordionRecipes key={equipmentSet.id} summary={equipmentSet.name} recipes={recipes} />
            ))}
          </TabPanel>
        </Grid>
        <Grid item xs={4}>
          <FuiRecipeTable coreComponent={forge} />
        </Grid>
      </Grid>
    </FuiContainer>
  );
});

export { PageForge };

import { observer } from 'mobx-react';
import { Grid } from '@mui/material';
import { core } from '@FisherCore';
import { FuiDashboard, FuiContainer, FuiLineProgress, FuiSkillRecipeCard } from '@Fui';

const PageMining = observer(() => {
  const { mining } = core;
  const {
    packages: { recipes },
  } = mining;

  return (
    <FuiContainer>
      <FuiDashboard fisherComponent={mining} />
      <Grid container spacing={2}>
        {recipes.map((item) => {
          const isActive = Boolean(mining.activeRecipe?.id === item.id);
          return (
            <Grid key={item.id} item xs={3}>
              <FuiSkillRecipeCard
                skillLevel={mining.level}
                isActive={isActive}
                recipe={item}
                onStop={mining.stop}
                activeLabel="正在采集"
                onStart={() => mining.start(item)}
              >
                <FuiLineProgress value={isActive ? mining.skill.progress : 0} />
              </FuiSkillRecipeCard>
            </Grid>
          );
        })}
      </Grid>
    </FuiContainer>
  );
});

export { PageMining };

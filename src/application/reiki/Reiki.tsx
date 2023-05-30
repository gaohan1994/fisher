import { observer } from 'mobx-react';
import { Grid } from '@mui/material';
import { core } from '@FisherCore';
import { FuiContainer, FuiDashboard, FuiLineProgress, FuiSkillRecipeCard } from '@Fui';

const PageReiki = observer(() => {
  const { reiki } = core;
  const {
    packages: { recipes },
  } = reiki;

  return (
    <FuiContainer>
      <FuiDashboard collection={reiki} />
      <Grid container spacing={2}>
        {recipes.map((item) => {
          const isActive = Boolean(reiki.activeRecipe?.id === item.id);
          return (
            <Grid key={item.id} item xs={3}>
              <FuiSkillRecipeCard
                skillLevel={reiki.level}
                isActive={isActive}
                recipe={item}
                onStop={reiki.stop}
                onStart={() => reiki.start(item)}
                activeLabel="正在打坐"
                startButtonLabel={`在${item.name}打坐`}
                stopButtonLabel="停止打坐"
              >
                <FuiLineProgress value={isActive ? reiki.skill.progress : 0} />
              </FuiSkillRecipeCard>
            </Grid>
          );
        })}
      </Grid>
    </FuiContainer>
  );
});

export { PageReiki };

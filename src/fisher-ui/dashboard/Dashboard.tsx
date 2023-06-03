import React, { FC } from 'react';
import { Avatar, Box, Button, Card, CardContent, CardHeader, Collapse, Stack, Typography } from '@mui/material';
import {
  DungeonItem,
  EnemyItem,
  FisherComponent,
  PersonModeName,
  Recipe,
  isBattle,
  isDungeon,
  isWithFightComponent,
  isWithSkillComponent,
} from '@FisherCore';
import { FuiColor } from '../theme';
import { FuiExperienceDetail, FuiLevelChip } from '../experience';
import { ExpandMore, FuiActiveDashboardText } from '../text';
import { useRecipeInterval } from '../recipe/RecipeHook';
import { useFisherComponentExperience } from './Hook';
import { observer } from 'mobx-react';
import { BattleEnemySelector } from './BattleEnemySelector';
import { DungeonSelector } from './DungeonSelector';
import { FuiEnemyRewardPreview } from '../reward';
import { useBattleEnemyItemRewards } from './BattleHook';
import { useDungeonItemRewards } from './DungeonHook';
import { CenterBox } from '../container';

interface IFuiDashboard {
  fisherComponent: FisherComponent;
}
const FuiDashboard: React.FC<IFuiDashboard> = observer(({ fisherComponent }) => {
  const [expanded, setExpanded] = React.useState(false);
  const { experience } = useFisherComponentExperience(fisherComponent);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const dashboardHeader = (
    <Stack direction="row">
      <Typography sx={{ fontWeight: 'bold', mr: 2 }} variant="h5">
        {fisherComponent.name}
      </Typography>
      {experience && <FuiLevelChip experience={experience} />}
    </Stack>
  );

  const renderWithSkillComponentContent = isWithSkillComponent(fisherComponent) && (
    <React.Fragment>
      {Boolean(fisherComponent.activeRecipe && fisherComponent.isActive) ? (
        <ActiveRecipeInfo recipe={fisherComponent.activeRecipe!} />
      ) : (
        <FuiActiveDashboardText text="当前无活动" />
      )}
      <FuiExperienceDetail experience={fisherComponent.skill.experience} />
    </React.Fragment>
  );

  const withFightComponentAction = (
    <Button
      sx={{ mr: 1 }}
      variant="contained"
      color="warning"
      onClick={handleExpandClick}
      aria-expanded={expanded}
      aria-label="show more"
    >
      {expanded ? `收起${fisherComponent.name}列表` : `选择${fisherComponent.name}目标`}
      <ExpandMore expand={expanded} />
    </Button>
  );

  const isBattleComponent = isBattle(fisherComponent);
  const isDungeonComponent = isDungeon(fisherComponent);

  const renderWithFightComponentContent = isWithFightComponent(fisherComponent) && (
    <React.Fragment>
      <CenterBox direction="column" sx={{ mb: 2 }}>
        {isBattleComponent &&
          (fisherComponent.activeEnemyItem ? (
            <ActiveBattleInfo enemy={fisherComponent.activeEnemyItem} />
          ) : (
            <FuiActiveDashboardText text="暂无除魔目标" />
          ))}

        {isDungeonComponent &&
          (fisherComponent.activeDungeonItem ? (
            <ActiveDungeonInfo dungeon={fisherComponent.activeDungeonItem} />
          ) : (
            <FuiActiveDashboardText text="暂无挑战副本" />
          ))}
      </CenterBox>
      <FuiExperienceDetail experience={fisherComponent.master.person.experience} />
      <Collapse in={expanded} timeout="auto" unmountOnExit sx={{ mt: 2 }}>
        {isBattleComponent && <BattleEnemySelector onSelectEnemyItem={() => setExpanded(false)} />}
        {isDungeonComponent && <DungeonSelector onSelectDungeonItem={() => setExpanded(false)} />}
      </Collapse>
    </React.Fragment>
  );

  return (
    <Card sx={{ width: '100%', bgcolor: FuiColor.primary.background, p: 2, mb: 2 }}>
      <CardHeader
        sx={{ p: 0 }}
        avatar={<Avatar src={fisherComponent.media} />}
        action={withFightComponentAction}
        title={dashboardHeader}
      />
      <CardContent sx={{ p: 0, m: 0 }}>
        {renderWithSkillComponentContent}
        {renderWithFightComponentContent}
      </CardContent>
    </Card>
  );
});

interface IActiveRecipeInfo {
  recipe: Recipe;
}
const ActiveRecipeInfo: FC<IActiveRecipeInfo> = ({ recipe }) => {
  const { intervalSecond } = useRecipeInterval(recipe);
  return (
    <Box>
      <FuiActiveDashboardText text={recipe.name} />
      <FuiActiveDashboardText text={`${recipe.name} 间隔 ${intervalSecond} 秒`} />
      <FuiActiveDashboardText text={`经验奖励：${recipe.rewardExperience} 点`} />
    </Box>
  );
};

interface IActiveBattleInfo {
  enemy: EnemyItem;
}
const ActiveBattleInfo: FC<IActiveBattleInfo> = ({ enemy }) => {
  const { rewardItems, randomRewardItems } = useBattleEnemyItemRewards(enemy);
  return (
    <React.Fragment>
      <FuiActiveDashboardText text={`战斗目标：${enemy.name}`} />
      <FuiEnemyRewardPreview rewardItems={rewardItems} randomRewardItems={randomRewardItems} />
    </React.Fragment>
  );
};

interface IActiveDungeonInfo {
  dungeon: DungeonItem;
}
const ActiveDungeonInfo: FC<IActiveDungeonInfo> = ({ dungeon }) => {
  const { rewardItems, extraRewardItems } = useDungeonItemRewards(dungeon);
  return (
    <React.Fragment>
      <FuiActiveDashboardText text={`副本进度：${dungeon.progress + 1}/${dungeon.enemiesNumber}`} />
      <FuiActiveDashboardText text={`战斗目标：${dungeon.currentEnemyItem.name}`} />
      <FuiActiveDashboardText
        text={`目标类型：${PersonModeName[dungeon.currentEnemyItem.mode as keyof typeof PersonModeName]}`}
      />
      <FuiEnemyRewardPreview rewardItems={rewardItems} randomRewardItems={extraRewardItems} />
    </React.Fragment>
  );
};

export { FuiDashboard };

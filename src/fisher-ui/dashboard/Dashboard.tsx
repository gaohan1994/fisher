import React, { FC } from 'react';
import { Avatar, Button, Card, CardContent, CardHeader, Collapse, Divider, Stack, Typography } from '@mui/material';
import {
  DungeonItem,
  EnemyItem,
  FisherComponent,
  PersonModeName,
  Recipe,
  core,
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
import { useDungeonEnemyRewardMap, useDungeonProgressReward } from './DungeonHook';
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
      <CenterBox direction="column" sx={{ mb: 2 }}>
        {Boolean(fisherComponent.activeRecipe && fisherComponent.isActive) ? (
          <ActiveRecipeInfo recipe={fisherComponent.activeRecipe!} />
        ) : (
          <FuiActiveDashboardText text="当前无活动" />
        )}
      </CenterBox>
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

  const isFightComponent = isWithFightComponent(fisherComponent);
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
      <FuiExperienceDetail experience={core.master.person.experience} />
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
        action={isFightComponent && withFightComponentAction}
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
    <React.Fragment>
      <FuiActiveDashboardText text={recipe.name} />
      <FuiActiveDashboardText text={`${recipe.name} 间隔 ${intervalSecond} 秒`} />
      <FuiActiveDashboardText text={`经验奖励：${recipe.rewardExperience} 点`} />
    </React.Fragment>
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
  const { enemyRewards } = useDungeonEnemyRewardMap(dungeon);
  const { progressRewards } = useDungeonProgressReward(dungeon);
  return (
    <React.Fragment>
      <FuiActiveDashboardText text={`副本进度：${dungeon.progress + 1}/${dungeon.enemiesNumber}`} />
      <FuiActiveDashboardText text={`战斗目标：${dungeon.currentEnemyItem.name}`} />
      <FuiActiveDashboardText
        text={`怪物级别：${PersonModeName[dungeon.currentEnemyItem.mode as keyof typeof PersonModeName]}`}
      />
      <Stack direction="row">
        {enemyRewards.map(([enemyItem, { rewardItems, randomRewardItems }], index) => (
          <FuiEnemyRewardPreview
            key={`${enemyItem.id}-${index}`}
            tooltip={`${enemyItem.name}奖励列表`}
            rewardItems={rewardItems}
            randomRewardItems={randomRewardItems}
          />
        ))}
        <Divider orientation="vertical" flexItem sx={{ ml: 2, mr: 2 }} />
        {progressRewards.map(([progress, rewards], index) => (
          <FuiEnemyRewardPreview
            key={`${dungeon.id}${progress}`}
            tooltip={`副本进度 ${progress + 1} 奖励列表`}
            rewardItems={rewards}
          />
        ))}
      </Stack>
    </React.Fragment>
  );
};

export { FuiDashboard };

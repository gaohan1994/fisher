import React from 'react';
import { observer } from 'mobx-react';
import { Button, Card, CardContent, CardHeader, Typography, Box, Tooltip, Divider, Stack } from '@mui/material';
import { EquipmentItem, Forge, Cook, ItemType, NormalItem, Recipe, Skill } from '@FisherCore';
import { FuiColor, FuiEquipment, FuiItem, FuiLineProgress, notifycationStore } from '@Fui';
import { IUseRecipeItem, useRecipe, useRecipeInterval } from './RecipeHook';
import { FuiLevelInfo } from '../experience';

interface FuiRecipeTableRowProps {
  title: React.ReactNode;
}
const FuiRecipeTableRow: React.FC<React.PropsWithChildren<FuiRecipeTableRowProps>> = ({ title, children }) => (
  <Box sx={{ mb: 2 }}>
    <Typography sx={{ mb: 1 }}>{title}</Typography>
    {children}
  </Box>
);

interface FuiRecipeTableProps {
  coreComponent: Forge | Cook;
}
const FuiRecipeTable: React.FC<FuiRecipeTableProps> = observer(({ coreComponent }) => {
  const { activeRecipe, isActive, skill } = coreComponent;
  return (
    <Card sx={{ bgcolor: FuiColor.primary.background }}>
      <CardHeader
        sx={{ pb: 0 }}
        title={
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            锻造台
          </Typography>
        }
      />
      <CardContent>
        {activeRecipe === undefined && <Typography sx={{ mb: 2 }}>请先选择锻造图纸</Typography>}
        {activeRecipe !== undefined && <FuiRecipeDesc activeRecipe={activeRecipe} skill={skill} />}
        {isActive ? <FuiLineProgress value={skill.progress} /> : <FuiLineProgress value={0} />}
        <FuiRecipeButton coreComponent={coreComponent} />
      </CardContent>
    </Card>
  );
});

const RecipeDivider = () => <Divider sx={{ mt: 2, mb: 2 }} />;

interface FuiRecipeDescProps {
  activeRecipe: Recipe;
  skill: Skill;
}
const FuiRecipeDesc: React.FC<FuiRecipeDescProps> = observer(({ activeRecipe, skill }) => {
  const { rewardItems, randomRewardItems, costItems } = useRecipe(activeRecipe);
  const { intervalSecond } = useRecipeInterval(activeRecipe);

  const recipeLevelInfo = (
    <Stack>
      <Typography variant="caption">
        等级需求：
        <FuiLevelInfo level={activeRecipe.unlockLevel} />
      </Typography>
      <Typography variant="caption">
        当前技能等级：
        <FuiLevelInfo level={skill.experience.level} />
      </Typography>
      <Typography variant="caption">经验奖励：{activeRecipe.rewardExperience} Exp</Typography>
      <Typography variant="caption">制作间隔：{intervalSecond} 秒</Typography>
    </Stack>
  );

  const renderRecipeItem = React.useCallback((item: NormalItem) => {
    if (item.type === ItemType.Equipment) {
      return <FuiEquipment key={item.id} equipment={item as EquipmentItem} />;
    } else {
      return <FuiItem key={item.id} item={item} />;
    }
  }, []);

  const RecipeRowCard: React.FC<{ item: NormalItem; subHeader: React.ReactNode }> = ({ item, subHeader }) => (
    <CardHeader
      sx={{ p: 0, mb: 1 }}
      avatar={renderRecipeItem(item)}
      title={<Typography>{item.name}</Typography>}
      subheader={subHeader}
    />
  );

  const renderRecipeRow = React.useCallback(
    ([recipeItem, item]: IUseRecipeItem) => (
      <RecipeRowCard
        item={item}
        key={`${recipeItem.itemId}${recipeItem.itemQuantity}`}
        subHeader={<Typography variant="caption">数量 {` (${recipeItem.itemQuantity})`}</Typography>}
      />
    ),
    []
  );

  const renderRecipeCostRow = React.useCallback(([recipeItem, item]: IUseRecipeItem) => {
    const costControl = skill.recipeHandler.costControlMap.get(recipeItem.itemId)!;
    return (
      <RecipeRowCard
        item={item}
        key={`${recipeItem.itemId}${recipeItem.itemQuantity}`}
        subHeader={
          <Typography variant="caption" sx={{ color: !costControl.canBearCost ? 'red' : '' }}>
            数量 {` (${costControl.backpackItem?.quantity ?? 0} / ${recipeItem.itemQuantity})`}
          </Typography>
        }
      />
    );
  }, []);

  return (
    <React.Fragment>
      {recipeLevelInfo}
      <RecipeDivider />
      <FuiRecipeTableRow title="制作产物">{rewardItems.map(renderRecipeRow)}</FuiRecipeTableRow>
      <RecipeDivider />

      {activeRecipe!.hasRandomRewardItems && (
        <React.Fragment>
          <FuiRecipeTableRow title="上级制作产物">{randomRewardItems.map(renderRecipeRow)}</FuiRecipeTableRow>
          <RecipeDivider />
        </React.Fragment>
      )}

      {activeRecipe!.hasCostItems && (
        <React.Fragment>
          <FuiRecipeTableRow title="所需材料">{costItems.map(renderRecipeCostRow)}</FuiRecipeTableRow>
          <RecipeDivider />
        </React.Fragment>
      )}
    </React.Fragment>
  );
});

enum UnavailableReasons {
  InActiveRecipe = '请先选择锻造图纸',
  CanNotBearCost = '制作材料不足',
  UnlockLevel = '技能等级不足',
}
const FuiRecipeButton: React.FC<FuiRecipeTableProps> = observer(({ coreComponent }) => {
  const { isActive, activeRecipe, activeRecipeAvailable, skill, start, stop } = coreComponent;

  let unavailableReason: UnavailableReasons | undefined = undefined;

  if (!skill.recipeHandler.hasActiveRecipe) {
    unavailableReason = UnavailableReasons.InActiveRecipe;
  }

  if (!skill.recipeHandler.activeRecipeUnlockLevelAvailable) {
    unavailableReason = UnavailableReasons.UnlockLevel;
  }

  if (!skill.recipeHandler.activeRecipeBearCostAvailable) {
    unavailableReason = UnavailableReasons.CanNotBearCost;
  }

  const onRecipeButtonClick = React.useCallback(() => {
    try {
      if (isActive) {
        stop();
      } else {
        start();
      }
    } catch (error: any) {
      notifycationStore.alert('error', error.label);
    }
  }, [isActive, unavailableReason]);

  return (
    <Tooltip title={unavailableReason}>
      <Button
        variant="contained"
        sx={{ width: '100%', mt: 2 }}
        color={!activeRecipeAvailable ? 'error' : 'primary'}
        onClick={onRecipeButtonClick}
      >
        {activeRecipe === undefined && UnavailableReasons.InActiveRecipe}
        {activeRecipe !== undefined && `${isActive ? '停止' : '开始'}${activeRecipe.name}`}
      </Button>
    </Tooltip>
  );
});

export { FuiRecipeTable };

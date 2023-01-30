import React from 'react';
import { observer } from 'mobx-react';
import { Button, Card, CardContent, CardHeader, Typography, Box, Tooltip } from '@mui/material';
import { core, EquipmentItem, ItemType, NormalItem } from '@FisherCore';
import { FuiColor, FuiEquipment, FuiItem, FuiLineProgress, notifycationStore } from '@Fui';
import { IUseRecipeItem, useRecipe } from '../hook';

interface FuiForgeTableBoxProps {
  title: string;
}
const FuiForgeTableBox: React.FC<React.PropsWithChildren<FuiForgeTableBoxProps>> = ({ title, children }) => (
  <Box sx={{ mb: 2 }}>
    <Typography sx={{ mb: 1 }}>{title}</Typography>
    {children}
  </Box>
);

const FuiForgeTable = observer(() => {
  const { activeRecipe, isActive, skill } = core.forge;
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
        {activeRecipe !== undefined && <FuiForgeRecipeDesc />}
        {isActive ? <FuiLineProgress value={skill.progress} /> : <FuiLineProgress value={0} />}
        <FuiForgeButton />
      </CardContent>
    </Card>
  );
});

const FuiForgeRecipeDesc: React.FC = observer(() => {
  const { activeRecipe, skill } = core.forge;
  const { rewardItems, randomRewardItems, costItems } = useRecipe(activeRecipe!);

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
      <FuiForgeTableBox title="产物">{rewardItems.map(renderRecipeRow)}</FuiForgeTableBox>
      {activeRecipe!.hasRandomRewardItems && (
        <FuiForgeTableBox title="上级产物">{randomRewardItems.map(renderRecipeRow)}</FuiForgeTableBox>
      )}
      {activeRecipe!.hasCostItems && (
        <FuiForgeTableBox title="所需材料">{costItems.map(renderRecipeCostRow)}</FuiForgeTableBox>
      )}
    </React.Fragment>
  );
});

enum UnavailableReasons {
  InActiveRecipe = '请先选择锻造图纸',
  CanNotBearCost = '锻造材料不足',
  UnlockLevel = '锻造等级不足',
}
const FuiForgeButton: React.FC = observer(() => {
  const { isActive, activeRecipe, activeRecipeAvailable, skill, start, stop } = core.forge;

  const unavailableReason = React.useMemo(() => {
    if (!skill.recipeHandler.hasActiveRecipe) {
      return UnavailableReasons.InActiveRecipe;
    }

    if (!skill.recipeHandler.activeRecipeUnlockLevelAvailable) {
      return UnavailableReasons.UnlockLevel;
    }

    if (!skill.recipeHandler.activeRecipeBearCostAvailable) {
      return UnavailableReasons.CanNotBearCost;
    }

    return undefined;
  }, []);

  const onForgeClick = () => {
    if (unavailableReason !== undefined) {
      return notifycationStore.alert('error', unavailableReason);
    }

    if (isActive) {
      return stop();
    }
    start();
  };

  return (
    <Tooltip title={unavailableReason}>
      <Button
        variant="contained"
        sx={{ width: '100%', mt: 2 }}
        color={!activeRecipeAvailable ? 'error' : 'primary'}
        onClick={onForgeClick}
      >
        {activeRecipe === undefined && UnavailableReasons.InActiveRecipe}
        {activeRecipe !== undefined && `${isActive ? '停止' : '开始'}${activeRecipe.name}`}
      </Button>
    </Tooltip>
  );
});

export { FuiForgeTable };

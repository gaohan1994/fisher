import { FC } from 'react';
import { observer } from 'mobx-react';
import { Box, Button, colors, LinearProgress, Stack, Typography } from '@mui/material';
import { DemoLayout } from './DemoLayout';
import { core, store } from '@FisherCore';
import { FuiItem } from '@Fui';

export const ForgeDemo: FC = observer(() => {
  const { forge } = core;
  const { skill, activeRecipe, experience, level, levelUpExperience, isActive, packages } = forge!;

  return (
    <DemoLayout title="锻造">
      <div>技能 {skill.id}</div>
      <div>技能状态 {isActive ? '激活' : '未激活'}</div>
      <div>
        技能等级 {level} / {99}
      </div>
      <div>
        技能经验 {experience} / {levelUpExperience}
      </div>
      <Stack direction="row" spacing={1}>
        {packages.map((recipe) => {
          const forgeItems = recipe.rewardItems.map(({ itemId }) => store.findItemById(itemId));

          return (
            <Box key={recipe.id}>
              <Typography>配方奖励：</Typography>
              {forgeItems.map((forgeItem) => (
                <Stack key={`${recipe.id}${forgeItem}`} direction="row" spacing={1}>
                  <FuiItem item={forgeItem} />
                  <Typography>{forgeItem.name}</Typography>
                </Stack>
              ))}
              <Stack direction="column">
                <Typography>所需材料：</Typography>
                <Stack direction="row" spacing={1}>
                  {recipe.costItems?.map(({ itemId, itemQuantity }) => {
                    const item = store.findItemById(itemId);
                    return (
                      <Stack key={`${recipe.id}${itemId}`} direction="row" spacing={1}>
                        <FuiItem item={item} />
                        <Typography>
                          {item.name} x {itemQuantity}
                        </Typography>
                      </Stack>
                    );
                  })}
                </Stack>
              </Stack>
              <Button onClick={() => forge.setActiveRecipe(recipe)}>{recipe.name}</Button>
            </Box>
          );
        })}
      </Stack>

      {activeRecipe && (
        <Box>
          <div>
            {forge.isActive ? '正在' : '准备'} {activeRecipe.name}
          </div>
          <Typography>所需材料：</Typography>
          <Stack direction="row" spacing={1}>
            {forge.skill.recipeHandler.costControls.map(({ canBearCost, costItem, backpackItem }) => {
              const item = store.findItemById(costItem.itemId);

              return (
                <Stack key={`${costItem.itemId}`} direction="row" spacing={1}>
                  <FuiItem item={item} />

                  {canBearCost ? (
                    <Typography sx={{ color: colors.lightGreen[700] }}>
                      {item.name} x {costItem.itemQuantity}
                    </Typography>
                  ) : (
                    <Typography sx={{ color: colors.red.A200 }}>
                      {item.name} x {costItem.itemQuantity}{' '}
                      {`（还需 ${costItem.itemQuantity - (backpackItem?.quantity ?? 0)} 个）`}
                    </Typography>
                  )}
                </Stack>
              );
            })}
          </Stack>

          <Stack spacing={1}>
            <LinearProgress variant="determinate" value={forge.skill.progress} />
            {forge.isActive ? (
              <Button variant="contained" onClick={() => forge.stop()}>
                停止 {activeRecipe.name}
              </Button>
            ) : (
              <Button variant="contained" onClick={() => forge.start()}>
                开始 {activeRecipe.name}
              </Button>
            )}
          </Stack>
        </Box>
      )}
    </DemoLayout>
  );
});

import { FC } from 'react';
import { observer } from 'mobx-react';
import { Button, LinearProgress, Stack } from '@mui/material';
import { DemoLayout } from './DemoLayout';

export const ReikiDemo: FC = observer(() => {
  const { reiki } = fisher;
  const {
    skill,
    activeRecipe,
    levelInfo,
    isActive,
    start,
    stop,
    packagesData: { recipePartMap },
  } = reiki;

  const renderRecipeParts: React.ReactNode[] = [];

  recipePartMap?.forEach((recipes, partName) => {
    renderRecipeParts.push(
      <ul key={partName}>
        <h3>{partName}</h3>
        {recipes.map((item) => {
          const isActiveRecipe = activeRecipe?.id === item.id;
          return (
            <li key={item.id}>
              {isActiveRecipe ? (
                <LinearProgress variant="determinate" value={skill.progress} />
              ) : (
                <LinearProgress variant="determinate" value={0} />
              )}
              <Stack direction="row" spacing={1}>
                {isActiveRecipe ? (
                  <Button variant="contained" onClick={stop}>
                    停止采集{item.rewardItem.name}
                  </Button>
                ) : (
                  <Button variant="contained" onClick={() => start(item)}>
                    开始采集{item.rewardItem.name}
                  </Button>
                )}
                {`（${isActiveRecipe ? '激活' : '未激活'}）`}
              </Stack>
            </li>
          );
        })}
      </ul>
    );
  });

  return (
    <DemoLayout title="灵气Demo">
      <div>技能 {skill.id}</div>
      <div>技能状态 {isActive ? '激活' : '未激活'}</div>
      <div>
        技能等级 {levelInfo.level} / {99}
      </div>
      <div>
        技能经验 {levelInfo.experience} / {levelInfo.totalExperienceToLevelUp}
      </div>
      {activeRecipe && <div>正在采集 {activeRecipe.name}</div>}
      {renderRecipeParts}
    </DemoLayout>
  );
});

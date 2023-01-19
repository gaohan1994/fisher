import { FC } from 'react';
import { observer } from 'mobx-react';
import { Button, LinearProgress, Stack } from '@mui/material';
import { core } from '@FisherCore';

const FuiMining = observer(() => {
  const { mining } = core;
  const {
    skill,
    level,
    experience,
    levelUpExperience,
    activeRecipe,
    isActive,
    start,
    stop,
    packages: { recipes },
  } = mining;

  return (
    <div>
      <div>技能 {skill.id}</div>
      <div>技能状态 {isActive ? '激活' : '未激活'}</div>
      <div>
        技能等级 {level} / {99}
      </div>
      <div>
        技能经验 {experience} / {levelUpExperience}
      </div>
      {activeRecipe && <div>正在采集 {activeRecipe.name}</div>}
      <ul>
        {recipes.map((item) => {
          const isActiveRecipe = item.id === activeRecipe?.id;
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
                    停止采集
                  </Button>
                ) : (
                  <Button variant="contained" onClick={() => start(item)}>
                    采集{item.name}
                  </Button>
                )}
                {`（${isActiveRecipe ? '激活' : '未激活'}）`}
              </Stack>
            </li>
          );
        })}
      </ul>
    </div>
  );
});

export { FuiMining };

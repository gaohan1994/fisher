import { useState } from 'react';
import { observer } from 'mobx-react';
import { FisherPersonLevel, PersonLevel } from '@FisherCore';
import { Button, Stack, Typography } from '@mui/material';
import { DemoLayout } from './DemoLayout';

export const FisherPersonLevelDemo = observer(() => {
  const [level] = useState(() => new FisherPersonLevel());

  return (
    <DemoLayout title="FisherPersonLevelDemo">
      <div>等级组件</div>
      <Button onClick={() => level.initialize(PersonLevel.GasRefiningEarly)}>
        初始化
      </Button>
      <Typography>境界：{level.state}</Typography>
      <Typography>等级：{level.label}</Typography>
      <Typography>
        获胜的战斗次数 / 升级所需获胜战斗次数：
        {level.levelUpRequirementsCompletion.battleTimes} /{' '}
        {level.levelUpRequirements.battleTimes}
      </Typography>
      <Typography>系数：{level.coefficient}</Typography>
      <Stack>
        <Button
          onClick={() => {
            level.updateBattleTimes(level.coefficient * 1000);
          }}
        >
          满进度
        </Button>
        <Button onClick={level.manualLevelUp}>提升境界</Button>
      </Stack>
    </DemoLayout>
  );
});

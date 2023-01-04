import { useState } from 'react';
import { observer } from 'mobx-react';
import { store, PersonLevelManager } from '@FisherCore';
import { Button, Typography } from '@mui/material';
import { DemoLayout } from './DemoLayout';

const levels = [...store.personLevelMap.values()];

export const FisherPersonLevelDemo = observer(() => {
  const [levelManager] = useState(() => new PersonLevelManager());

  return (
    <DemoLayout title="FisherPersonLevelDemo">
      <div>等级组件</div>
      <Typography>{levelManager.name}</Typography>
      <Typography>系数：{levelManager.coefficient}</Typography>

      {levels.map((item) => (
        <Button
          key={item.level}
          onClick={() => levelManager.initialize(item.level)}
        >
          初始化{item.name}
        </Button>
      ))}
    </DemoLayout>
  );
});

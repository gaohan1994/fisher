import { FC, useState } from 'react';
import { Button, Drawer } from '@mui/material';
import { experienceConfig } from '@FisherCore';
import { DemoLayout } from './DemoLayout';

export const ExperienceDemo: FC = () => {
  const [visible, setVisbile] = useState(false);
  const { config } = experienceConfig;
  return (
    <DemoLayout title="经验模块">
      技能升级经验数据
      <Button fullWidth variant="contained" onClick={() => setVisbile(true)}>
        展示数据
      </Button>
      <Drawer open={visible} anchor="right" onClose={() => setVisbile(false)}>
        <h3>技能升级经验列表</h3>
        <ul>
          {config.map((experience, index) => (
            <li key={index}>
              <span>等级: {index}</span>
              <span>经验: {experience}</span>
            </li>
          ))}
        </ul>
      </Drawer>
    </DemoLayout>
  );
};

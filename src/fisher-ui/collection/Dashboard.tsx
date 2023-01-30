import React from 'react';
import { observer } from 'mobx-react';
import { Avatar, Box, Card, CardContent, CardHeader, Chip, Stack, Typography } from '@mui/material';
import { Forge, Mining, Reiki } from '@FisherCore';
import { FuiColor } from '../theme';
import { FuiLineProgress } from '../progress';

interface Props {
  collection: Mining | Reiki | Forge;
}
const FuiDashboard: React.FC<Props> = observer(({ collection }) => {
  const { name, media, skill, activeRecipe, isActive } = collection;
  return (
    <Card sx={{ width: '100%', bgcolor: FuiColor.primary.background, p: 2, mb: 2 }}>
      <CardHeader
        sx={{ p: 0 }}
        avatar={<Avatar src={media} />}
        title={
          <Stack direction="row">
            <Typography sx={{ fontWeight: 'bold' }} variant="h5">
              {name}
            </Typography>
            <Chip
              sx={{ ml: 2 }}
              label={`等级 ${skill.experience.level} / ${skill.experience.maxLevel}`}
              color="success"
            />
          </Stack>
        }
      />
      <CardContent sx={{ p: 0, m: 0 }}>
        <Typography variant="caption" color="secondary" component="div" textAlign="center" sx={{ mb: 1 }}>
          {activeRecipe && isActive
            ? `正在${activeRecipe.name}，${collection.name}间隔 ${activeRecipe.interval / 1000} 秒，每次经验奖励 ${
                activeRecipe.rewardExperience
              } 点`
            : '当前无活动'}
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
          <Typography variant="caption">升级经验值</Typography>
          <Chip
            sx={{ ml: 1 }}
            label={`${skill.experience.experience} / ${skill.experience.levelUpExperience}`}
            color="primary"
          />
        </Box>
        <FuiLineProgress
          value={(skill.experience.experience / skill.experience.levelUpExperience) * 100}
          color="primary"
        />
      </CardContent>
    </Card>
  );
});

export { FuiDashboard };

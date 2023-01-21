import React from 'react';
import { observer } from 'mobx-react';
import { Avatar, Box, Card, CardContent, CardHeader, Chip, Stack, Typography } from '@mui/material';
import { core } from '@FisherCore';
import { FuiColor, FuiLineProgress } from '@Fui';

const FuiDashboard: React.FC = observer(() => {
  const { name, media, skill, activeRecipe } = core.mining;
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
          {activeRecipe
            ? `正在${activeRecipe.name}，采集间隔 ${activeRecipe.interval / 1000} 秒，每次采集奖励经验 ${
                activeRecipe.rewardExperience
              } 点`
            : '当前无采集'}
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

import React, { PropsWithChildren } from 'react';
import { Avatar, Box, Card, CardContent, CardHeader, Chip, Stack, Typography } from '@mui/material';
import { Experience, FisherComponent } from '@FisherCore';
import { FuiColor } from '../theme';
import { FuiLineProgress } from '../progress';

interface IFuiBaseDashboard {
  fisherComponent: FisherComponent;

  action?: React.ReactNode;
  experience?: Experience;
}
const FuiBaseDashboard: React.FC<PropsWithChildren<IFuiBaseDashboard>> = ({
  fisherComponent,
  action,
  experience,
  children,
}) => (
  <Card sx={{ width: '100%', bgcolor: FuiColor.primary.background, p: 2, mb: 2 }}>
    <CardHeader
      sx={{ p: 0 }}
      avatar={<Avatar src={fisherComponent.media} />}
      action={action}
      title={
        <Stack direction="row">
          <Typography sx={{ fontWeight: 'bold' }} variant="h5">
            {fisherComponent.name}
          </Typography>
          {experience && (
            <Chip sx={{ ml: 2 }} label={`等级 ${experience.level} / ${experience.maxLevel}`} color="success" />
          )}
        </Stack>
      }
    />
    <CardContent sx={{ p: 0, m: 0 }}>
      {children}
      {experience && (
        <React.Fragment>
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <Typography variant="caption">升级经验值</Typography>
            <Chip sx={{ ml: 1 }} label={`${experience.experience} / ${experience.levelUpExperience}`} color="primary" />
          </Box>
          <FuiLineProgress value={(experience.experience / experience.levelUpExperience) * 100} color="primary" />
        </React.Fragment>
      )}
    </CardContent>
  </Card>
);

export { FuiBaseDashboard };

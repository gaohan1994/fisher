import { FC } from 'react';
import { observer } from 'mobx-react';
import { Experience } from '@FisherCore';
import { Box, Typography } from '@mui/material';
import { FuiLineProgress } from '../progress';
import { FuiExperienceChip } from './LevelInfo';

interface IFuiExperienceDetail {
  experience: Experience;
}
const FuiExperienceDetail: FC<IFuiExperienceDetail> = observer(({ experience }) => (
  <Box>
    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
      <Typography variant="caption" sx={{ mr: 1 }}>
        升级经验值
      </Typography>
      <FuiExperienceChip experience={experience} />
    </Box>
    <FuiLineProgress value={(experience.experience / experience.levelUpExperience) * 100} />
  </Box>
));

export { FuiExperienceDetail };

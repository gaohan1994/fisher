import { LinearProgress } from '@mui/material';
import { FC } from 'react';

interface FuiLineProgressProps {
  value: number;
}
const FuiLineProgress: FC<FuiLineProgressProps> = ({ value }) => {
  return <LinearProgress variant="determinate" color="progress" value={value} sx={{ height: 15 }} />;
};

export { FuiLineProgress };

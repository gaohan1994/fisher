import { LinearProgress } from '@mui/material';
import { FC } from 'react';

interface FuiLineProgressProps {
  value: number;
  color?: any;
}
const FuiLineProgress: FC<FuiLineProgressProps> = ({ value, color }) => {
  return <LinearProgress variant="determinate" color={color ?? 'progress'} value={value} sx={{ height: 15 }} />;
};

export { FuiLineProgress };

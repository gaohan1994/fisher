import { LinearProgress } from '@mui/material';
import { FC } from 'react';

interface FuiLineProgressProps {
  value: number;
  color?: any;
  label?: string;
}
const FuiLineProgress: FC<FuiLineProgressProps> = ({ label, value, color }) => {
  return (
    <div style={{ position: 'relative' }}>
      <LinearProgress variant="determinate" color={color ?? 'progress'} value={value} sx={{ height: 15 }} />
      {label}
    </div>
  );
};

export { FuiLineProgress };

import React, { FC } from 'react';
import { LinearProgress } from '@mui/material';

interface FuiLineProgressProps {
  value: number;
  color?: any;
  label?: React.ReactNode;
}
const FuiLineProgress: FC<FuiLineProgressProps> = ({ label, value, color }) => {
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <LinearProgress variant="determinate" color={color ?? 'progress'} value={value} sx={{ height: 15 }} />
      {label && (
        <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }}>{label}</div>
      )}
    </div>
  );
};

export { FuiLineProgress };

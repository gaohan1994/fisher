import { FC } from 'react';
import { LinearProgressProps } from '@mui/material';
import { ProgressBox, ProgressLabel, ProgressMain } from './Styled';

interface ProgressProps extends LinearProgressProps {
  value: number;
  label?: boolean;
}
export const Progress: FC<ProgressProps> = ({ value, label = false, ...rest }) => (
  <ProgressBox>
    <ProgressMain value={value} {...rest} />
    {label && <ProgressLabel>{value}</ProgressLabel>}
  </ProgressBox>
);

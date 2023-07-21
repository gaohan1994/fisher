import { styled, Box, Typography, LinearProgress, LinearProgressProps } from '@mui/material';

export const ProgressBox = styled(Box)(({ theme }) => ({
  position: 'relative',
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

export const ProgressLabel = styled(Typography)(() => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
}));

const DefaultProgressHeight = 15;
interface ProgressMainProps extends LinearProgressProps {
  height?: number;
}
export const ProgressMain = styled(({ height, ...rest }: ProgressMainProps) => (
  <LinearProgress variant="determinate" color="progress" {...rest} />
))(({ height = DefaultProgressHeight }) => ({
  height,
}));

import { Typography, TypographyProps, styled } from '@mui/material';
import { useLevelColor } from './Hook';

interface ColorLevelTextProps extends TypographyProps {
  level: number;
}
export const ColorLevelText = styled(({ level, ...rest }: ColorLevelTextProps) => {
  const color = useLevelColor(level);
  return <Typography variant="caption" color={color} {...rest} />;
})(() => ({ fontWeight: 'bold' }));

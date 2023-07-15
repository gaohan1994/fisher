import { Typography, TypographyProps, styled } from '@mui/material';
import { useLevelColor } from './Hook';

interface ColorLevelText extends TypographyProps {
  level: number;
}
export const ColorLevelText = styled(({ level, ...rest }: ColorLevelText) => {
  const color = useLevelColor(level);
  return <Typography variant="caption" color={color} {...rest} />;
})(() => ({ fontWeight: 'bold' }));

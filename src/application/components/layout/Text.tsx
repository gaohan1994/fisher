import { Typography, TypographyProps, styled } from '@mui/material';

interface ICardHeaderText extends TypographyProps {}
export const CardHeaderText = styled((props: ICardHeaderText) => (
  <Typography id="card-header-text" variant="h5" {...props} />
))(() => ({
  fontWeight: 'bold',
}));

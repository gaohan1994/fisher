import { Box, BoxProps, styled } from '@mui/material';

interface ICenterBox extends BoxProps {
  direction: 'row' | 'column';
}
const CenterBox = styled((props: ICenterBox) => {
  const { direction, ...rest } = props;
  return <Box {...rest} />;
})(({ direction }) => ({
  display: 'flex',
  flexDirection: direction,
  alignItems: 'center',
  justifyContent: 'center',
}));

export { CenterBox };

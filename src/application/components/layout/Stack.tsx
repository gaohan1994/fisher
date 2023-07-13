import { Stack, StackProps, styled } from '@mui/material';

interface IStackSpaceBetween extends StackProps {}
/**
 * Children layout space-between Stack component
 */
export const StackSpaceBetween = styled((props: IStackSpaceBetween) => <Stack direction="row" {...props} />)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
}));

import { Stack, StackProps, styled } from '@mui/material';

interface IStackSpaceBetween extends StackProps {}
/**
 * Children layout space-between Stack component
 */
export const StackSpaceBetween = styled((props: IStackSpaceBetween) => (
  <Stack id="stack-space-between" direction="row" {...props} />
))(() => ({
  display: 'flex',
  justifyContent: 'space-between',
}));

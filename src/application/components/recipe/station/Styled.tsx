import { ButtonProps, ListItem, ListSubheader, Typography, TypographyProps, styled } from '@mui/material';
import { RecipeButton } from '../common';

interface StationButtonProps extends ButtonProps {
  reason: string;
}
export const StationButton = styled(({ reason, ...rest }: StationButtonProps) => (
  <RecipeButton color={reason === '' ? 'success' : 'error'} {...rest} />
))(() => ({}));

export const StationSubHeader = styled(ListSubheader)(() => ({ backgroundColor: 'transparent', paddingLeft: 0 }));

export const RewardListItem = styled(ListItem)(({ theme }) => ({
  padding: 0,
  '& #item-avatar': {
    marginRight: theme.spacing(1),
  },
}));

export const RewardText = styled(({ ...rest }: TypographyProps) => (
  <Typography variant="caption" color="primary" {...rest} />
))(() => ({}));

interface RewardCostTextProps extends TypographyProps {
  requirement: boolean;
}
export const RewardCostText = styled(({ requirement, ...rest }: RewardCostTextProps) => (
  <RewardText variant="caption" color={requirement ? 'primary' : 'error'} {...rest} />
))(() => ({}));

import { Avatar, Card, CardProps, styled } from '@mui/material';

import { FuiColor } from '../../theme';

interface ActiveAreaCardProps extends CardProps {
  active: boolean;
}
export const ActiveAreaCard = styled(({ active, ...rest }: ActiveAreaCardProps) => <Card {...rest} />)(
  ({ active }) => ({
    border: '1px solid',
    backgroundColor: FuiColor.primary.background,
    borderColor: active ? FuiColor.gold : FuiColor.common.black,
    '& .MuiCardContent-root': {
      paddingTop: 0,
    },
  })
);

export const NoBorderAvatar = styled(Avatar)(() => ({
  '&.MuiAvatar-root': {
    border: 'none',
  },
}));

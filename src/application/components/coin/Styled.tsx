import { Avatar, AvatarProps, styled } from '@mui/material';

const CoinMediaSize = 20;
export const CoinMedia = styled((props: AvatarProps) => <Avatar variant="square" {...props} />)(() => ({
  width: CoinMediaSize,
  height: CoinMediaSize,
}));

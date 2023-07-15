import {
  Avatar,
  AvatarProps,
  Badge,
  BadgeProps,
  Box,
  BoxProps,
  Card,
  Popover,
  PopoverProps,
  Typography,
  TypographyProps,
  styled,
} from '@mui/material';
import { FuiColor } from '../theme';
import { ItemPopoverVariant } from './Constants';

interface FuiItemBoxProps extends BoxProps {
  active?: boolean;
}
export const FuiItemBox = styled(({ active, ...rest }: FuiItemBoxProps) => <Box {...rest} />)(({ active }: any) => ({
  border: '1px solid',
  width: 'fit-content',
  position: 'relative',
  borderColor: active ? FuiColor.item.activeBorderColor : FuiColor.item.borderColor,
  '&:hover': {
    borderColor: FuiColor.item.activeBorderColor,
  },
}));

const FuiItemAvatarSize = 50;
export const FuiItemAvatar = styled(({ ...rest }: AvatarProps) => <Avatar variant="square" {...rest} />)(
  ({ theme }) => ({
    width: FuiItemAvatarSize,
    height: FuiItemAvatarSize,
    padding: theme.spacing(1),
    backgroundColor: FuiColor.item.background,
  })
);

export const FuiItemBadge = styled(({ ...rest }: BadgeProps) => (
  <Badge
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    {...rest}
  />
))(() => ({
  '& .MuiBadge-badge': {
    right: 10,
    bottom: 10,
  },
}));

interface FuiItemPopoverProps extends PopoverProps {
  variant: ItemPopoverVariant;
}
export const FuiItemPopover = styled(({ variant, ...rest }: FuiItemPopoverProps) => (
  <Popover
    id="item-popover"
    anchorOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'left',
    }}
    disableRestoreFocus
    {...rest}
  />
))(({ variant }) => ({
  ...(variant === ItemPopoverVariant.MouseOver ? { pointerEvents: 'none' } : {}),
}));

const FuiItemDetailWidth = 300;
export const FuiItemDetailCard = styled(Card)(() => ({
  position: 'relative',
  width: FuiItemDetailWidth,
  backgroundColor: FuiColor.item.background,
  '& #item-detail-card-content': {
    paddingTop: 0,
  },
}));

interface FuiItemNameTextProps extends TypographyProps {
  color: string;
}
export const FuiItemNameText = styled(({ color, ...rest }: FuiItemNameTextProps) => (
  <Typography variant="inherit" component="span" {...rest} />
))(({ color }) => ({
  color,
  fontWeight: 'bold',
}));

export const FuiItemDescText = styled(({ ...rest }: TypographyProps) => (
  <Typography variant="caption" component="span" {...rest} />
))(() => ({
  color: FuiColor.item.desc,
  fontWeight: 'bold',
}));

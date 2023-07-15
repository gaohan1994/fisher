import { FC } from 'react';
import { Item } from '@FisherCore';
import { TypographyProps } from '@mui/material';
import { useItemName } from './Hook';
import { FuiItemNameText } from './Styled';

interface FuiItemNameProps extends TypographyProps {
  item: Item;
}
export const FuiItemName: FC<FuiItemNameProps> = ({ item, ...rest }) => {
  const { name, color } = useItemName(item);
  return (
    <FuiItemNameText {...rest} color={color}>
      {name}
    </FuiItemNameText>
  );
};

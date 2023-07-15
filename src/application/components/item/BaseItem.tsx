import { FC, PropsWithChildren } from 'react';
import { Item } from '@FisherCore';

import { useItemQuantity } from './Hook';
import { FuiItemAvatar, FuiItemBadge, FuiItemBox } from './Styled';

interface FuiBaseItemProps {
  item: Item;
  showBorder?: boolean;
  showQuantity?: boolean;
  quantity?: number;
  onClick?: (...rest: any[]) => void;
}
const FuiBaseItem: FC<PropsWithChildren<FuiBaseItemProps>> = ({
  item,
  showBorder,
  showQuantity,
  quantity = undefined,
  onClick,
  children,
  ...rest
}) => {
  const backpackQuantity = useItemQuantity(item);
  const onItemClick = (event: any) => {
    onClick?.(event);
  };
  return (
    <FuiItemBox {...rest} active={showBorder} onClick={onItemClick}>
      <FuiItemBadge badgeContent={showQuantity ? quantity ?? backpackQuantity : null}>
        <FuiItemAvatar src={item.media} />
      </FuiItemBadge>
      {children}
    </FuiItemBox>
  );
};

export { FuiBaseItem };
export type { FuiBaseItemProps };

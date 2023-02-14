import React from 'react';
import { observer } from 'mobx-react';
import { BackpackItem, isEquipmentItem } from '@FisherCore';
import { FuiItem, FuiItemDetail, FuiItemProps } from '../item';
import { FuiEquipment, FuiEquipmentDetail } from '../equipment';

interface BackpackItemRenderProps extends Pick<FuiItemProps, 'onClick' | 'showBorder' | 'renderItem'> {
  backpackItem: BackpackItem;
}
const FuiBackpackItemRender: React.FC<BackpackItemRenderProps> = observer(({ backpackItem, ...rest }) => {
  const commonProps = {
    showQuantity: true,
  };

  if (isEquipmentItem(backpackItem.item)) {
    return <FuiEquipment {...rest} {...commonProps} equipment={backpackItem.item} />;
  }

  return <FuiItem {...rest} {...commonProps} item={backpackItem.item} />;
});

interface BackpackItemDetailRenderProps {
  backpackItem: BackpackItem;
}
const FuiBackpackItemDetailRender: React.FC<BackpackItemDetailRenderProps> = ({ backpackItem }) => {
  if (isEquipmentItem(backpackItem.item)) {
    return (
      <FuiItemDetail item={backpackItem.item}>
        <FuiEquipmentDetail equipment={backpackItem.item} />
      </FuiItemDetail>
    );
  }

  return <FuiItemDetail item={backpackItem.item} />;
};

export { FuiBackpackItemRender, FuiBackpackItemDetailRender };

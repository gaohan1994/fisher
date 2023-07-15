import { FC } from 'react';
import { EquipmentItem } from '@FisherCore';

import { EquipmentContentBox, EquipmentText } from '../Styled';
import { useEquipmentSlotName } from './Hook';

interface InfoProps {
  equipment: EquipmentItem;
}
export const Info: FC<InfoProps> = ({ equipment }) => {
  const slotName = useEquipmentSlotName(equipment);
  return (
    <EquipmentContentBox>
      <EquipmentText>装备类型：{slotName}</EquipmentText>
    </EquipmentContentBox>
  );
};

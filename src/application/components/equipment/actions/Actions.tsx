import { FC } from 'react';
import { FisherAction } from '@FisherCore';

import { EquipmentContentBox, EquipmentText } from '../Styled';
import { EquipmentActionsBox } from './Styled';

interface ActionsProps {
  actions: FisherAction[];
}
export const Actions: FC<ActionsProps> = ({ actions }) => (
  <EquipmentContentBox>
    {actions.map((action, index) => (
      <EquipmentActionsBox key={`${action.id}-${index}`}>
        <EquipmentText>{`特效 · ${action.name}`}</EquipmentText>
        <EquipmentText>{action.desc}</EquipmentText>
      </EquipmentActionsBox>
    ))}
  </EquipmentContentBox>
);

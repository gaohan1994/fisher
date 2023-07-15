import { FC, PropsWithChildren } from 'react';
import { Divider, Stack } from '@mui/material';
import { EquipmentItem } from '@FisherCore';

import { Info } from './info';
import { Attributes } from './attribute';
import { Actions } from './actions';
import { Sets } from './sets';
import { useEquipmentActions, useEquipmentAttributes, useEquipmentSet } from './Hook';

interface EquipmentDetailProps {
  equipment: EquipmentItem;
}
/**
 * Render equipment detail include:
 * - Equipment base info
 * - Equipment attributes
 * - Equipment set (if has equipment set)
 * - Equipment actions (if has equipment actions)
 * - The others (if has others)
 * @returns
 */
export const EquipmentDetail: FC<PropsWithChildren<EquipmentDetailProps>> = ({ equipment, children }) => {
  const attributes = useEquipmentAttributes(equipment);
  const equipmentSet = useEquipmentSet(equipment);
  const actions = useEquipmentActions(equipment);
  return (
    <Stack spacing={1} divider={<Divider />}>
      <Info equipment={equipment} />
      <Attributes attributes={attributes} />
      {equipmentSet && <Sets equipmentSet={equipmentSet} />}
      {Boolean(actions.length) && <Actions actions={actions} />}
      {children}
    </Stack>
  );
};

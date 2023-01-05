import { FC, Fragment, useState } from 'react';
import { observer } from 'mobx-react';
import { Box, Button, Popover, Stack, Typography } from '@mui/material';
import { EquipmentItem } from '@FisherCore';
import { FuiItem } from '../item';

interface FuiEquipmentProps {
  equipment: EquipmentItem;
}

export const FuiEquipment: FC<FuiEquipmentProps> = observer(({ equipment }) => {
  return <FuiItem item={equipment} />;
});

import React from 'react';
import { Typography, CardContent, Avatar, Card } from '@mui/material';
import { Assets, EquipmentItem, EquipmentSlotName } from '@FisherCore';

interface FuiEmptyEquipmentDetailBaseProps {
  text: React.ReactNode;
  media?: string;
}
const FuiEmptyEquipmentDetailBase: React.FC<FuiEmptyEquipmentDetailBaseProps> = ({ text, media }) => (
  <Card sx={{ bgcolor: 'transparent' }} elevation={0}>
    <CardContent
      sx={{ height: 280, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
    >
      <Typography>{text}</Typography>
      {media && <Avatar sx={{ mt: 1 }} src={media} variant="square" />}
    </CardContent>
  </Card>
);

interface FuiEmptySlotEquipmentDetailProps {
  equipment?: EquipmentItem;
}
const FuiEmptyEquipmentDetail: React.FC<FuiEmptySlotEquipmentDetailProps> = ({ equipment }) => {
  if (equipment === undefined) {
    return <FuiEmptyEquipmentDetailBase text="空" media={Assets.EmptyEquipmentSlot} />;
  }

  const name = EquipmentSlotName[equipment.slot];
  const equipmentSlodAssets = Assets[`Empty${equipment.slot}` as keyof typeof Assets];
  return <FuiEmptyEquipmentDetailBase text={`${name}-空`} media={equipmentSlodAssets} />;
};

export { FuiEmptyEquipmentDetail };

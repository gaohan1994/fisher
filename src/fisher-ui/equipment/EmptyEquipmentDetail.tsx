import React from 'react';
import { Typography, CardContent, Avatar, Card } from '@mui/material';
import { Assets, PersonEquipment } from '@FisherCore';

interface FuiEmptyEquipmentDetailBaseProps {
  text: React.ReactNode;
  media?: string;
}
const FuiEmptyEquipmentDetailBase: React.FC<FuiEmptyEquipmentDetailBaseProps> = ({ text, media }) => {
  return (
    <Card sx={{ bgcolor: 'transparent' }} elevation={0}>
      <CardContent
        sx={{ height: 280, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
      >
        <Typography>{text}</Typography>
        {media && <Avatar sx={{ mt: 1 }} src={media} variant="square" />}
      </CardContent>
    </Card>
  );
};

interface FuiEmptyPersonEquipmentDetailProps {
  personEquipment: PersonEquipment;
}
const FuiEmptyPersonEquipmentDetail: React.FC<FuiEmptyPersonEquipmentDetailProps> = ({ personEquipment }) => (
  <FuiEmptyEquipmentDetailBase
    text={personEquipment.emptyEquipment.name}
    media={personEquipment.emptyEquipment.media}
  />
);

const FuiEmptyEquipmentDetail: React.FC = () => (
  <FuiEmptyEquipmentDetailBase text="空" media={Assets.EmptyEquipmentSlot} />
);

export { FuiEmptyPersonEquipmentDetail, FuiEmptyEquipmentDetail };

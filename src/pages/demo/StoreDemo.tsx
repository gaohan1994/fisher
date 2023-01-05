import { FC, PropsWithChildren } from 'react';
import { EquipmentItem, store } from '@FisherCore';
import { DemoLayout } from './DemoLayout';
import { FuiEquipment } from '../../components/equipment';
import { FuiItem } from '../../components/item';
import { Stack } from '@mui/material';

export const StoreDemo = () => {
  return (
    <DemoLayout title="Store">
      <Stack direction="row">
        {store.items.map((item, index) => {
          if (item instanceof EquipmentItem) {
            return <FuiEquipment key={`${item.id}${index}`} equipment={item} />;
          }
          return <FuiItem key={`${item.id}${index}`} item={item} />;
        })}
      </Stack>
    </DemoLayout>
  );
};

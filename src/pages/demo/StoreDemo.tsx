import { store } from '@FisherCore';
import { DemoLayout } from './DemoLayout';
import { FuiEquipment } from '../../components/equipment';
import { FuiItem } from '../../components/item';
import { Stack, Typography } from '@mui/material';

export const StoreDemo = () => {
  return (
    <DemoLayout title="Store">
      <Typography>装备列表</Typography>
      <Stack direction="row">
        {store.Equipments.map((item, index) => {
          return <FuiEquipment key={`${item.id}${index}`} equipment={item} />;
        })}
      </Stack>

      <Typography>矿</Typography>
      <Stack direction="row">
        {store.Mining.items.map((item, index) => {
          return <FuiItem key={`${item.id}${index}`} item={item} />;
        })}
      </Stack>

      <Typography>灵气</Typography>
      <Stack direction="row">
        {store.Reiki.items.map((item, index) => {
          return <FuiItem key={`${item.id}${index}`} item={item} />;
        })}
      </Stack>
    </DemoLayout>
  );
};

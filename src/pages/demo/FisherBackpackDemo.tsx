import { FC, Fragment, useRef } from 'react';
import { observer } from 'mobx-react';
import {
  Button,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  Stack,
} from '@mui/material';
import { FisherBackpackItem, FisherItem, FisherItemType } from '@FisherCore';
import { DemoLayout } from './DemoLayout';

export const createTestBackpackItemPayload = (index: string) => ({
  id: 'Test:Backpack:' + index,
  name: 'Test:BackpackItemName' + index,
  price: 10,
  media: '',
  desc: 'Test:BackpackItemDesc',
  type: FisherItemType.Test,
});

export const FisherBackpackDemo: FC = observer(() => {
  const { fisherBackpack } = fisher;
  const testItemIndex = useRef(1);

  const addNewItem = () => {
    const item = new FisherItem(
      createTestBackpackItemPayload(`${testItemIndex.current++}`)
    );
    fisherBackpack.addItem(item, 1);
  };

  return (
    <DemoLayout title="FisherBackpackDemo">
      <div>current backpack size: {fisherBackpack.items.size}</div>
      <List>
        {fisherBackpack.backpackItems.map((item: FisherBackpackItem) => (
          <ListItem
            key={item.item.id}
            secondaryAction={
              <Stack>
                <Button
                  onClick={() => fisherBackpack.addItem(item.item, 1)}
                  sx={{ textTransform: 'none' }}
                >
                  add 1
                </Button>
                <Button
                  onClick={() => fisherBackpack.reduceItem(item.item, 1)}
                  sx={{ textTransform: 'none' }}
                >
                  redeuce 1
                </Button>
              </Stack>
            }
          >
            <ListItemText
              primary={
                <Fragment>
                  <Checkbox
                    checked={fisherBackpack.selectedItems.has(item)}
                    onChange={() => fisherBackpack.toggleSelectItem(item)}
                  />
                  {item.item.name}
                </Fragment>
              }
              secondary={`price: ${item.item.price} quantity: ${item.quantity}`}
            />
          </ListItem>
        ))}
      </List>
      <Stack direction="row" spacing={1}>
        <Button onClick={addNewItem} variant="contained">
          Add new Backpack Item
        </Button>
        <Button
          variant="contained"
          onClick={() => fisherBackpack.sellSelectedItems()}
          disabled={fisherBackpack.selectedItems.size <= 0}
        >
          Sell all selected items {fisherBackpack.selectedItems.size}
        </Button>
      </Stack>
    </DemoLayout>
  );
});

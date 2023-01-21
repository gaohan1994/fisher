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
import { core, BackpackItem, NormalItem } from '@FisherCore';
import { DemoLayout } from './DemoLayout';

export const createTestBackpackItemPayload = (index: string) => ({
  id: 'Test:Backpack:' + index,
  name: 'Test:BackpackItemName' + index,
  price: 10,
  media: '',
  desc: 'Test:BackpackItemDesc',
});

export const FisherBackpackDemo: FC = observer(() => {
  const { backpack } = core;
  const testItemIndex = useRef(1);

  const addNewItem = () => {
    const item = new NormalItem(
      createTestBackpackItemPayload(`${testItemIndex.current++}`)
    );
    backpack.addItem(item, 1);
  };

  return (
    <DemoLayout title="FisherBackpackDemo">
      <div>current backpack size: {backpack.items.size}</div>
      <List>
        {backpack.backpackItems.map((item: BackpackItem) => (
          <ListItem
            key={item.item.id}
            secondaryAction={
              <Stack>
                <Button
                  onClick={() => backpack.addItem(item.item, 1)}
                  sx={{ textTransform: 'none' }}
                >
                  add 1
                </Button>
                <Button
                  onClick={() => backpack.reduceItem(item.item, 1)}
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
                    checked={backpack.selectedItems.has(item)}
                    onChange={() => backpack.toggleSelectItem(item)}
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
          onClick={() => backpack.sellSelectedItems()}
          disabled={backpack.selectedItems.size <= 0}
        >
          Sell all selected items {backpack.selectedItems.size}
        </Button>
      </Stack>
    </DemoLayout>
  );
});

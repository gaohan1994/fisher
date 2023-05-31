import { describe, expect, test } from 'vitest';
import { Information } from '../fisher-information';
import { NormalItem } from '../fisher-item';

const testItem = {
  id: 'LowSpiritMine',
  name: '低灵矿石',
  desc: '一种很常见的矿石，灵气和纯度较低',
  media: '',
  price: 5,
};

describe('Information', () => {
  test('should success create item message', () => {
    const information = Information.create();

    const item = new NormalItem(testItem);
    const itemMessage = new Information.ItemMessage(item, 1);
    expect(itemMessage.variant).toEqual('Item');
    expect(itemMessage.message).toStrictEqual({
      prefix: '您',
      item,
      quantity: 1,
    });

    const alertId = information.alert([itemMessage]);

    expect(information.alertMessageHandlers.length).toEqual(1);
    expect(information.alertMessageHandlers[0].messages[0]).toStrictEqual(itemMessage);
    expect(alertId).toEqual(2);

    information.closeMessage(alertId);

    expect(information.alertMessageHandlers.length).toEqual(0);
  });
});

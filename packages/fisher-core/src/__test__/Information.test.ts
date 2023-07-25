import { describe, expect, test, vi } from 'vitest';
import { Information, InformationMessage } from '../fisher-information';
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

    let alertMessages = [];
    const spyAlertAction = vi.fn().mockImplementation((result: InformationMessage[]) => {
      alertMessages.push(...result);
    });

    let tipMessages = [];
    const spyTipAction = vi.fn().mockImplementation((result: InformationMessage[]) => {
      tipMessages.push(...result);
    });

    information.event.on(Information.InformationEventKeys.AlertMessage, spyAlertAction);
    information.event.on(Information.InformationEventKeys.TipMessage, spyTipAction);

    const item = new NormalItem(testItem);
    const itemMessage = new Information.ItemMessage(item, 1);
    expect(itemMessage.variant).toEqual('Item');
    expect(itemMessage.message).toStrictEqual({
      prefix: '您',
      item,
      quantity: 1,
    });

    information.alert([itemMessage]);
    expect(spyAlertAction).toBeCalled();
  });
});

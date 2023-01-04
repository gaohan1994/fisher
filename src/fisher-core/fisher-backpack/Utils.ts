import { Item, FisherBackpackItem } from '@FisherCore';

/**
 * 计算传入的 item 的售价
 *
 * @export
 * @param {Item} item
 * @param {number} [quantity=1]
 * @return {*}
 */
export function calculateItemPrice(
  item: Item | FisherBackpackItem,
  quantity: number = 1
) {
  let totalPrice = 0;
  if (isFisherItem(item)) {
    totalPrice = item.price * quantity;
  } else {
    totalPrice = item.item.price * quantity;
  }
  return Math.max(Math.floor(totalPrice), 0);
}

/**
 * 校验传入的 item 是否是 Item
 *
 * @param {(Item | FisherBackpackItem)} item
 * @return {*}  {item is Item}
 */
export function isFisherItem(item: Item | FisherBackpackItem): item is Item {
  return item instanceof Item;
}

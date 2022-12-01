import { FisherItem, FisherBackpackItem } from '@FisherCore';

/**
 * 计算传入的 item 的售价
 *
 * @export
 * @param {FisherItem} item
 * @param {number} [quantity=1]
 * @return {*}
 */
export function calculateItemPrice(
  item: FisherItem | FisherBackpackItem,
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
 * 校验传入的 item 是否是 FisherItem
 *
 * @param {(FisherItem | FisherBackpackItem)} item
 * @return {*}  {item is FisherItem}
 */
export function isFisherItem(
  item: FisherItem | FisherBackpackItem
): item is FisherItem {
  return item instanceof FisherItem;
}

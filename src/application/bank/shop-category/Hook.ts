import { ShopCategoryHandler } from '@FisherCore';
import { useBank } from '../../core';

/**
 * Return category handlers
 * @returns
 */
export const useCartgoryHandlers = () => {
  const bank = useBank();
  return bank.categoryHandlers;
};

/**
 * Return shop category name
 * @param {ShopCategoryHandler} handler
 * @returns
 */
export const useShopCategoryName = (handler: ShopCategoryHandler) => {
  return handler.shopCategory.name;
};

/**
 * Return shop category include items
 * @param {ShopCategoryHandler} handler
 * @returns
 */
export const useShopCategoryItems = (handler: ShopCategoryHandler) => {
  return handler.categoryItems;
};

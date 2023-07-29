import { useBank, useCart } from '../core';
import { useCartgoryHandlers, shopStore } from './shop-category';

/**
 * Return cart items
 * @returns
 */
export const useCartItems = () => {
  const cart = useCart();
  return cart.items;
};

/**
 * Return cart total payment amount
 * @returns
 */
export const useCartPayment = () => {
  const cart = useCart();
  return cart.paymentAmount;
};

/**
 * Return bank gold
 * @returns
 */
export const useBankGold = () => {
  const bank = useBank();
  return bank.gold;
};

/**
 * Return current selected category handlers
 * If all return full category handlers
 */
export const useActiveShopCategoryHandlers = () => {
  const allCategoryHandler = useCartgoryHandlers();
  const { showAllShopCategories, selectedShopCategoryHandler } = shopStore;
  if (showAllShopCategories) return allCategoryHandler;
  return [selectedShopCategoryHandler!];
};

import { Store } from '../Store.js';

const store = new Store();

describe('Store test', () => {
  it('should success initialzie store ', () => {
    expect(store.normalItems.length > 0).toBeTruthy();
    expect(store.rewardChests.length > 0).toBeTruthy();
    expect(store.miningItems.length > 0).toBeTruthy();
    expect(store.miningRecipes.length > 0).toBeTruthy();
    expect(store.reikiItems.length > 0).toBeTruthy();
    expect(store.reikiRecipes.length > 0).toBeTruthy();
    expect(store.forgeRecipes.length > 0).toBeTruthy();
    expect(store.forgeBluePrints.length > 0).toBeTruthy();
    expect(store.cookRecipes.length > 0).toBeTruthy();
    expect(store.cookBluePrints.length > 0).toBeTruthy();
    expect(store.equipments.length > 0).toBeTruthy();
    expect(store.equipmentSets.length > 0).toBeTruthy();
    expect(store.battleAreas.length > 0).toBeTruthy();
    expect(store.battleEnemies.length > 0).toBeTruthy();
    expect(store.dungeons.length > 0).toBeTruthy();
    expect(store.shopCategories.length > 0).toBeTruthy();
    expect(store.healPotions.length > 0).toBeTruthy();
  });
});

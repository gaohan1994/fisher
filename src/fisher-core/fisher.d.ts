interface IFisherSetActiveActionId {
  (value: string): void;
}

declare module fisher {
  const activeActionId: string;
  const setActiveActionId: IFisherSetActiveActionId;

  // type definetion for window
  const fisherGold: import('./fisher-gold').FisherGold;
  const fisherBackpack: import('./fisher-backpack').FisherBackpack;
}

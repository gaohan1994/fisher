interface IFisherSetActiveActionId {
  (value: string): void;
}

declare module fisher {
  const activeActionId: string;
  const setActiveActionId: IFisherSetActiveActionId;
  const packagesData: import('./fisher-packages').IFisherPackagesData;
  const fisherGold: import('./fisher-gold').FisherGold;
  const fisherBackpack: import('./fisher-backpack').FisherBackpack;
  const mining: import('./fisher-modules').Mining;
  const fisherActionControl: import('./fisher-action-control').FisherActionControl;
}

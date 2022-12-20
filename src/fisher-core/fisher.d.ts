interface ISetActiveComponent<T> {
  (component: T): void;
}

declare module fisher {
  const activeComponentId: string;
  const setActiveComponent: ISetActiveComponent;
  const master: import('./fisher-person').FisherPerson;
  const fisherGold: import('./fisher-gold').FisherGold;
  const fisherBackpack: import('./fisher-backpack').FisherBackpack;
  const fisherActionControl: import('./fisher-action-control').FisherActionControl;
  const mining: import('./fisher-modules').Mining;
  const reiki: import('./fisher-modules').Reiki;
}

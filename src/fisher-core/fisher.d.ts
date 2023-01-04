interface ISetActiveComponent<T> {
  (component: T): void;
}

declare module fisher {
  const activeComponentId: string;
  const setActiveComponent: ISetActiveComponent;
  const master: import('./fisher-person').FisherPerson;
  const fisherGold: import('./fisher-gold').FisherGold;
  const backpack: import('./fisher-backpack').Backpack;
  const mining: import('./fisher-modules').Mining;
  const reiki: import('./fisher-modules').Reiki;
  const fisherPrompt: import('./fisher-prompt').FisherPrompt;
}

declare module window {
  const store: import('./fisher-packages/Store').Store;
  const fisher: fisher;
}

import { makeAutoObservable } from 'mobx';
import { core, ComponentId, FisherComponent } from '@FisherCore';

class FuiRouteHandler {
  private routeMatchMap = new Map<ComponentId, FuiRoute>();

  public get values() {
    return [...this.routeMatchMap];
  }

  constructor() {
    makeAutoObservable(this);
    const { componentManager } = core;
    componentManager.components.forEach((component) => {
      this.routeMatchMap.set(component.id as ComponentId, new FuiRoute(component));
    });
  }

  public getComponentRoute = (id: ComponentId | string) => {
    return this.routeMatchMap.get(id as ComponentId);
  };
}

class FuiRoute {
  public component: FisherComponent;

  public get id() {
    return this.component.id;
  }

  public get name() {
    return this.component.name;
  }

  public get path() {
    return this.id.toLocaleLowerCase();
  }

  constructor(component: FisherComponent) {
    this.component = component;
  }
}

const fuiRouteHandler = new FuiRouteHandler();

export { fuiRouteHandler };

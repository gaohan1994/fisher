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
  public id: string;

  public name: string;

  public path: string;

  public component: any;

  constructor(component: FisherComponent) {
    this.id = component.id;
    this.name = component.name;
    this.path = this.id.toLocaleLowerCase();
    this.component = component;
  }
}

const fuiRouteHandler = new FuiRouteHandler();

export { fuiRouteHandler };

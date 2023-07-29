import { service, IocService, inject } from '../ioc.js';

@service('A')
class ServiceA {
  id = 'A';
}

@service('B')
class ServiceB {
  id = 'B';
  constructor(@inject('A') public readonly serviceA: ServiceA) {}
}

@service('C')
class ServiceC {
  id = 'C';
  constructor(@inject('A') readonly serviceA: ServiceA, @inject('B') readonly serviceB: ServiceB) {}
}

it('should success register service', () => {
  const iocService = new IocService();
  iocService.init();

  // Node iocService will also register iocService itself!!
  expect(iocService.serviceStore.size).toEqual(4);

  const serviceA: ServiceA = iocService.getService('A');
  const serviceB: ServiceB = iocService.getService('B');
  const serviceC: ServiceC = iocService.getService('C');

  expect(serviceB.serviceA).toEqual(serviceA);

  expect(serviceC.serviceA).toEqual(serviceA);
  expect(serviceC.serviceB).toEqual(serviceB);
});

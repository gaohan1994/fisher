import 'reflect-metadata';

export enum PackageName {
  Mining = 'Mining',
  Reiki = 'Reiki',
}

/**
 * 每个模块的数据都会通过 RegisterPackages 注入到各自类和 packagesMap 中
 */
export const packagesMap = new Map<PackageName, any>();

abstract class PackageComponent {
  public static package: PackageName;
  public static packageData: any;
  public name: string = '';
}

export function RegisterPackageComponent<
  T extends { new (...args: any[]): {} }
>(constructor: T) {
  return class extends constructor {
    package = 'package';
  };
}

export class TestPackage {
  static packageData: any[];
}

Reflect.defineMetadata('custom:annotation', [1], TestPackage, 'packageData');

import { useEffect } from 'react';
import 'reflect-metadata';

function Type(type: any) {
  return Reflect.metadata('design:type', type);
}

function second() {
  console.log('second(): factory evaluated');
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    console.log('second(): called', target, propertyKey, descriptor);
  };
}

class C {
  @second()
  method(): void {}
}

const formatMetadataKey = 'format';

function format(message: string) {
  return Reflect.metadata(formatMetadataKey, message);
}

function getFormat(target: any, propertyKey: string) {
  return Reflect.getMetadata(formatMetadataKey, target, propertyKey);
}

class Greeter {
  @format('Hello %s')
  greeting: string = '';

  constructor(value: string) {
    this.greeting = value;
  }

  greet() {
    const formatValue = getFormat(this, 'greeting');
    return formatValue.replace('%s', this.greeting);
  }
}

class C1 {
  constructor() {}
}

const Dev = () => {
  useEffect(() => {
    const c = new C();
    const greeter = new Greeter('Ghan');
    console.log('greeter.greet()', greeter.greet());
  }, []);

  return <div>dev</div>;
};
export { Dev };

import { EventEmitter } from 'smar-util';

const cartEvents = new EventEmitter();

enum CartEventKeys {
  AddItem = 'AddItem',
  SetItem = 'SetItem',
  DeleteItem = 'DeleteItem',
  ClearItem = 'ClearItem',
}

export { cartEvents, CartEventKeys };

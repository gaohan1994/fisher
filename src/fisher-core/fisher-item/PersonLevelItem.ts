import { AbstractItem, ItemType } from './Item';

export enum PersonLevel {
  GasRefiningEarly = 'GasRefiningEarly',
  GasRefiningMiddle = 'GasRefiningMiddle',
  GasRefiningLater = 'GasRefiningLater',
}

enum PersonLevelState {
  GasRefining = 'GasRefining',
}

abstract class PersonLevelStateItem {
  public abstract id: string;

  public abstract state: PersonLevelState;

  public abstract name: string;

  public abstract nextState: PersonLevelState | undefined;
}

export abstract class PersonLevelItem extends AbstractItem {
  type = ItemType.PersonLevel;

  public abstract level: PersonLevel;

  public abstract nextLevel: PersonLevel | undefined;

  public abstract coefficient: number;

  public abstract state: PersonLevelStateItem;
}

class StateGasRefining extends PersonLevelStateItem {
  public id = 'StateGasRefining';

  public state = PersonLevelState.GasRefining;

  public name = '炼气期';

  public nextState = undefined;
}

export class GasRefiningEarly extends PersonLevelItem {
  public id = 'GasRefiningEarly';

  public readonly level = PersonLevel.GasRefiningEarly;

  public readonly nextLevel = PersonLevel.GasRefiningMiddle;

  public readonly name = '炼气前期';

  public readonly desc = '大多数修士的境界';

  public readonly media = '';

  public readonly coefficient = 1;

  public readonly state = new StateGasRefining();
}

export class GasRefiningMiddle extends PersonLevelItem {
  public readonly id = 'GasRefiningMiddle';

  public readonly level = PersonLevel.GasRefiningMiddle;

  public readonly nextLevel = PersonLevel.GasRefiningLater;

  public readonly name = '炼气中期';

  public readonly desc = '大多数修士的境界';

  public readonly media = '';

  public readonly coefficient = 2;

  public readonly state = new StateGasRefining();
}

export class GasRefiningLater extends PersonLevelItem {
  public id = 'GasRefiningLater';

  public readonly level = PersonLevel.GasRefiningLater;

  public readonly nextLevel = undefined;

  public name = '炼气后期';

  public desc = '大多数修士的境界';

  public media = '';

  public coefficient = 3;

  public state = new StateGasRefining();
}

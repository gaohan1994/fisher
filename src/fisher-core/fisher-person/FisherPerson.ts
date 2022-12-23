import invariant from 'invariant';
import { makeAutoObservable } from 'mobx';
import { prefixes, prefixLogger } from '@FisherLogger';
import { FisherEquipmentSlot } from '@FisherCore';
import { AttributePanel } from './AttributePanel';
import { ActionManager, ActionMode } from './person-actions';
import { FisherPersonLevel, PersonLevel } from './fisher-person-level';
import {
  FisherPersonEquipmentManager,
  IFisherPersonRemoveEquipment,
  IFisherPersonUseEquipment,
} from './FisherPersonEquipmentManager';

enum PersonMode {
  Master = 'Master',
  Enemy = 'Enemy',
}

interface IFisherPerson {
  mode: PersonMode;
  name: string;
  level: PersonLevel;
}

/**
 * 人物类
 * 玩家和 NPC 都基于此类状态
 *
 * @export
 * @class FisherPerson
 */
export class FisherPerson {
  static readonly logger = prefixLogger(prefixes.FISHER_CORE, 'FisherPerson');
  public static readonly Mode = PersonMode;
  public static readonly Level = PersonLevel;

  public initialized = false;

  public initializedForBattle = false;

  public Hp: number = Infinity;

  public mode?: PersonMode = undefined;

  public name: string = 'DefaultName';

  public target?: FisherPerson = undefined;

  public personLevel: FisherPersonLevel = new FisherPersonLevel();

  public personEquipmentManager: FisherPersonEquipmentManager =
    new FisherPersonEquipmentManager();

  public attributePanel: AttributePanel = new AttributePanel(this);

  public actionManager = new ActionManager(this);

  public get Weapon() {
    const result = this.personEquipmentManager.equipmentMap.get(
      FisherEquipmentSlot.Weapon
    );
    invariant(result !== undefined, 'Fail get Weapon');
    return result;
  }

  public get Helmet() {
    const result = this.personEquipmentManager.equipmentMap.get(
      FisherEquipmentSlot.Helmet
    );
    invariant(result !== undefined, 'Fail get Helmet');
    return result;
  }

  public useEquipment: IFisherPersonUseEquipment = (...rest) => {
    this.personEquipmentManager.useEquipment(...rest);
  };

  public removeEquipment: IFisherPersonRemoveEquipment = (...rest) => {
    this.personEquipmentManager.removeEquipment(...rest);
  };

  constructor() {
    makeAutoObservable(this);
  }

  public initialize = ({ mode, name, level }: IFisherPerson) => {
    if (this.initialized) {
      FisherPerson.logger.error(`Already initialized person ${this.name}`);
      return;
    }
    this.mode = mode;
    this.name = name;
    this.personLevel.initialize({ level });
    this.initialized = true;
  };

  /**
   * 初始化战斗属性
   * 注册所有战斗 action
   *
   * @memberof FisherPerson
   */
  public initializeForBattle = () => {
    this.Hp = this.attributePanel.MaxHp;
    this.actionManager.registerActionMap();
  };

  public setTarget = (person: FisherPerson) => {
    this.target = person;
    if (!this.initializedForBattle) {
      this.initializeForBattle();
      this.initializedForBattle = true;
    }
  };

  public hurt = (value: number) => {
    this.Hp -= value;
  };

  public heal = (value: number) => {
    this.Hp += value;
  };

  public startBattle = () => {
    if (!this.initialized)
      return FisherPerson.logger.error('Try to start battle before initialize');
    if (!this.initializedForBattle)
      return FisherPerson.logger.error(
        'Try to start battle before initializedForBattle'
      );
    this.actionManager.startActions(ActionMode.Attack);
  };

  public stopBattle = () => {
    this.actionManager.stopActions();
  };
}

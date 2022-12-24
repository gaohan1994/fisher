import invariant from 'invariant';
import { action, computed, makeObservable, observable } from 'mobx';
import { FisherEquipmentSlot } from '@FisherCore';
import { prefixes, prefixLogger } from '@FisherLogger';
import { AttributePanel } from './AttributePanel';
import { ActionManager, ActionMode } from './person-actions';
import { FisherPersonLevel, PersonLevel } from './fisher-person-level';
import { FisherPersonEquipmentManager } from './FisherPersonEquipmentManager';
import type {
  IFisherPersonRemoveEquipment,
  IFisherPersonUseEquipment,
} from './FisherPersonEquipmentManager';

enum PersonMode {
  Master = 'Master',
  Enemy = 'Enemy',
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

  public readonly mode = '' as PersonMode;

  @observable
  public name = 'DefaultName';

  @observable
  public initialized = false;

  @observable
  public initializedForBattle = false;

  @observable
  public Hp = Infinity;

  @observable
  public target: FisherPerson | undefined = undefined;

  @observable
  public personLevel = new FisherPersonLevel();

  @observable
  public personEquipmentManager = new FisherPersonEquipmentManager();

  @observable
  public attributePanel = new AttributePanel(this);

  @observable
  public actionManager = new ActionManager(this);

  constructor() {
    makeObservable(this);
  }

  @computed
  public get Weapon() {
    const result = this.personEquipmentManager.equipmentMap.get(
      FisherEquipmentSlot.Weapon
    );
    invariant(result !== undefined, 'Fail get Weapon');
    return result;
  }

  @computed
  public get Helmet() {
    const result = this.personEquipmentManager.equipmentMap.get(
      FisherEquipmentSlot.Helmet
    );
    invariant(result !== undefined, 'Fail get Helmet');
    return result;
  }

  @action
  public useEquipment: IFisherPersonUseEquipment = (...rest) => {
    this.personEquipmentManager.useEquipment(...rest);
  };

  @action
  public removeEquipment: IFisherPersonRemoveEquipment = (...rest) => {
    this.personEquipmentManager.removeEquipment(...rest);
  };

  /**
   * 初始化人物，具体逻辑由子类实现
   *
   * @memberof FisherPerson
   */
  @action
  public initialize(payload: any) {
    throw new Error('Not implemented!');
  }

  /**
   * 初始化战斗属性
   * 注册所有战斗 action
   *
   * @memberof FisherPerson
   */
  @action
  public initializeForBattle = () => {
    this.Hp = this.attributePanel.MaxHp;
    this.actionManager.registerActionMap();
  };

  @action
  public setTarget = (person: FisherPerson) => {
    this.target = person;
    if (!this.initializedForBattle) {
      this.initializeForBattle();
      this.initializedForBattle = true;
    }
  };

  @action
  public hurt = (value: number) => {
    this.Hp -= value;
  };

  @action
  public heal = (value: number) => {
    this.Hp += value;
  };

  @action
  public startBattle = () => {
    if (!this.initialized)
      return FisherPerson.logger.error(
        `Try to start battle before initialize, Please call initialize${this.mode} method first!`
      );
    if (!this.initializedForBattle)
      return FisherPerson.logger.error(
        'Try to start battle before initializedForBattle'
      );
    this.actionManager.startActions(ActionMode.Attack);
  };

  @action
  public stopBattle = () => {
    this.actionManager.stopActions();
  };
}

import { makeAutoObservable } from 'mobx';
import { Item } from '../fisher-item';
import { coinItem } from '../fisher-packages';

interface IPromptItemOptions {}

interface IPromptMessage {
  item: Item;
  quantity: number;
}

/**
 * 提示信息类
 *
 * @export
 * @class Prompt
 */
export class Prompt {
  public static instance: Prompt;

  public static readonly create = () => {
    if (!Prompt.instance) {
      Prompt.instance = new Prompt();
    }
    return Prompt.instance;
  };

  public static readonly PromptInterval = 2000;

  public quene: IPromptMessage[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  public promptItem = (item: Item, quantity = 1, {}: IPromptItemOptions = {}) => {
    this.quene.push({ item, quantity });
    this.runQueneShiftTimer();
  };

  public promptGold = (gold: number) => {
    this.quene.push({ item: coinItem, quantity: gold });
    this.runQueneShiftTimer();
  };

  private runQueneShiftTimer = () => {
    setTimeout(() => {
      this.shiftQueneItem();
    }, Prompt.PromptInterval);
  };

  private shiftQueneItem = () => {
    this.quene.shift();
  };

  public clearQuene = () => {
    this.quene = [];
  };
}

export const prompt = Prompt.create();

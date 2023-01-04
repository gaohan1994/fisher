import { makeAutoObservable } from 'mobx';
import { Item } from '../fisher-item';
import { GoldItem } from '../fisher-packages';
import { FisherTimer } from '../fisher-timer';

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

  public static readonly getInstance = () => {
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

  public promptItem = (
    item: Item,
    quantity = 1,
    {}: IPromptItemOptions = {}
  ) => {
    this.quene.push({ item, quantity });
    this._shiftQuene();
  };

  public promptGold = (gold: number) => {
    this.quene.push({ item: GoldItem, quantity: gold });
    this._shiftQuene();
  };

  private _shiftQuene = () => {
    const timer = new FisherTimer('Prompt', () => this.quene.shift(), {
      once: true,
    });

    timer.startTimer(Prompt.PromptInterval);
  };
}

export const prompt = Prompt.getInstance();

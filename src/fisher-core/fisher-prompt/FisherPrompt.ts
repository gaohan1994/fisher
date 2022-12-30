import { makeAutoObservable } from 'mobx';
import { FisherItem } from '../fisher-item';
import { GoldItem } from '../fisher-packages';
import { FisherTimer } from '../fisher-timer';

interface IPromptItemOptions {}

interface IPromptMessage {
  item: FisherItem;
  quantity: number;
}

/**
 * 提示信息类
 *
 * @export
 * @class FisherPrompt
 */
export class FisherPrompt {
  public static instance: FisherPrompt;

  public static readonly getInstance = () => {
    if (!FisherPrompt.instance) {
      FisherPrompt.instance = new FisherPrompt();
    }
    return FisherPrompt.instance;
  };

  public static readonly PromptInterval = 2000;

  public quene: IPromptMessage[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  public promptItem = (
    item: FisherItem,
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
    const timer = new FisherTimer('FisherPrompt', () => this.quene.shift(), {
      fireImmediately: false,
      once: true,
    });

    timer.startTimer(FisherPrompt.PromptInterval);
  };
}

export const fisherPrompt = FisherPrompt.getInstance();

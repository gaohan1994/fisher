import { makeAutoObservable } from 'mobx';
import { prefixLogger, prefixes } from '@FisherLogger';
import { prompt } from '../fisher-prompt';
import { EventKeys, events } from '../fisher-events';
import { ArchiveInterface } from '../fisher-archive';
import { store } from '../fisher-packages';
import { ShopCategory } from '../fisher-item';
import { ShopCategoryHandler } from './ShopCategoryHandler';
import { Cart } from './Cart';
import { Assets } from '../assets';

export class Bank {
  static logger = prefixLogger(prefixes.FISHER_CORE, 'Bank');

  public static instance: Bank;

  public static create(): Bank {
    if (!Bank.instance) {
      Bank.instance = new Bank();
    }
    return Bank.instance;
  }

  public get archive(): ArchiveInterface.ArchiveBank {
    return {
      gold: this.gold,
    };
  }

  public readonly id = 'Bank';

  public readonly name = '商店';

  public readonly media = Assets.bank;

  public gold: number = 0;

  public cart = new Cart();

  public categoryHandlerMap = new Map<ShopCategory, ShopCategoryHandler>();

  public get categoryHandlers() {
    return [...this.categoryHandlerMap.values()];
  }

  constructor() {
    makeAutoObservable(this);

    for (let index = 0; index < store.Shop.length; index++) {
      const shopCategory = store.Shop[index];
      this.categoryHandlerMap.set(shopCategory, new ShopCategoryHandler(shopCategory));
    }

    events.on(EventKeys.Archive.LoadArchive, this.onLoadArchive);
    events.on(EventKeys.Bank.ReceiveGold, this.receiveGold);
  }

  private onLoadArchive = (values: ArchiveInterface.ArchiveValues) => {
    if (values.bank === undefined) {
      Bank.logger.info('Archive bank value was undefined clear gold');
      this.clearGold();
    } else {
      Bank.logger.info('Load archive bank values', values.bank);
      this.setGold(values.bank.gold);
    }
  };

  public receiveGold = (value: number) => {
    this.gold += value;
    Bank.logger.debug(`Receive gold: ${value}, current: ${this.gold}`);

    events.emit(EventKeys.Update.BankUpdate, this);
    prompt.promptGold(value);
  };

  public setGold = (value: number) => {
    this.gold = value;
  };

  public clearGold = () => {
    this.gold = 0;
  };

  public checkGoldBalanceReadyToPay = (paymentAmount: number) => {
    return this.gold >= paymentAmount;
  };
}

export const bank = Bank.create();

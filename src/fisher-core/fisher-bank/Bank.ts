import { makeAutoObservable } from 'mobx';
import { prefixLogger, prefixes } from '@FisherLogger';
import { EventKeys, events } from '../fisher-events';
import { ArchiveInterface } from '../fisher-archive';
import { coinItem, store } from '../fisher-packages';
import { ShopCategory } from '../fisher-item';
import { ShopCategoryHandler } from './ShopCategoryHandler';
import { Cart } from './Cart';
import { Assets } from '../assets';
import { Information } from '../fisher-information';

class Bank {
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

  public cart = new Cart(this);

  public get categoryHandlers() {
    return [...this.categoryHandlerMap.values()];
  }

  public get categoryHandlerMap() {
    let result = new Map<ShopCategory, ShopCategoryHandler>();
    for (let index = 0; index < store.Shop.length; index++) {
      const shopCategory = store.Shop[index];
      result.set(shopCategory, new ShopCategoryHandler(shopCategory));
    }
    return result;
  }

  private constructor() {
    makeAutoObservable(this);

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

  public receiveGold = (value: number, shouldAlertInformation = false) => {
    this.gold += value;
    Bank.logger.debug(`Receive gold: ${value}, current: ${this.gold}`);

    const message = new Information.ItemMessage(coinItem, value);
    events.emit(EventKeys.Information.Messages, [message], shouldAlertInformation);
    events.emit(EventKeys.Update.BankUpdate, this);
  };

  public setGold = (value: number) => {
    this.gold = value;
  };

  public clearGold = () => {
    this.gold = 0;
  };

  public checkGoldBalance = (payment: number) => {
    return this.gold >= payment;
  };
}

export { Bank };

import { ReactNode } from 'react';
import { makeAutoObservable } from 'mobx';
import { AlertColor } from '@mui/material';
import { Timer } from '@FisherCore';

class FuiNotifyItem {
  public color: AlertColor;
  public message: ReactNode;

  constructor(color: AlertColor, message: ReactNode) {
    this.color = color;
    this.message = message;
  }
}

interface NotifycationItemDispose {
  timer: Timer;
  disposer: () => void;
}

class NotifycationStore {
  public static readonly AlertDuration = 2000;

  public alertMap = new Map<FuiNotifyItem, NotifycationItemDispose>();

  public get alerts() {
    return [...this.alertMap];
  }

  public static create(color: AlertColor, message: ReactNode): FuiNotifyItem {
    return new FuiNotifyItem(color, message);
  }

  constructor() {
    makeAutoObservable(this);
  }

  public alert = (color: AlertColor, message: ReactNode) => {
    const item = NotifycationStore.create(color, message);
    const timer = new Timer('Notify:Alert', () => this.alertMap.delete(item));

    const disposer = () => {
      timer.stopTimer();
      this.alertMap.delete(item);
    };

    timer.startTimer(NotifycationStore.AlertDuration);
    this.alertMap.set(item, { timer, disposer });
  };
}

const notifycationStore = new NotifycationStore();

export { notifycationStore, NotifycationStore };

let storage: Storage = {
  setItem: () => {},
  getItem: () => {},
} as any;

if (typeof window !== undefined && typeof window.localStorage !== undefined) {
  storage = window.localStorage;
}

export class LoggerStorage {
  static setValue = (key: string, value: any): void => {
    storage.setItem(key, JSON.stringify(value));
  };

  static getValue = <T>(key: string, defaultValue?: T): T => {
    const value = storage.getItem(key);
    if (!value && defaultValue !== undefined) {
      this.setValue(key, defaultValue);
      return defaultValue;
    }
    return JSON.parse(value as any);
  };

  static updateValue = <T>(storeKey: string, key: string, value: any): void => {
    const prevValue = LoggerStorage.getValue<T>(storeKey);
    const nextValue = {
      ...prevValue,
      [key]: value,
    };
    LoggerStorage.setValue(storeKey, nextValue);
  };

  static clearValue = (storeKey: string, value: any = '') => {
    LoggerStorage.setValue(storeKey, value);
  };
}

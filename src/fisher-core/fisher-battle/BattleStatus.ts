import { makeAutoObservable } from 'mobx';

enum IBattleStatus {
  Initial,
  EnemyLoading,
  Fighting,
}

class BattleStatus {
  public static IBattleStatus = IBattleStatus;

  public status = IBattleStatus.Initial;

  public get isFighting() {
    return this.status === IBattleStatus.Fighting;
  }

  public get isInitial() {
    return this.status === IBattleStatus.Initial;
  }

  public get isEnemyLoading() {
    return this.status === IBattleStatus.EnemyLoading;
  }

  constructor() {
    makeAutoObservable(this);
  }

  public initial = () => {
    this.status = IBattleStatus.Initial;
  };

  public enemyLoading = () => {
    this.status = IBattleStatus.EnemyLoading;
  };

  public fighting = () => {
    this.status = IBattleStatus.Fighting;
  };
}

export { BattleStatus };

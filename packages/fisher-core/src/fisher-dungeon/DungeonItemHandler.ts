import { makeAutoObservable } from 'mobx';
import { DungeonItem, EnemyItem } from '@item';

export class DungeonItemHandler {
  public current: number = 0;

  public get currentEnemy(): EnemyItem {
    return this.dungeonItem.enemies[this.current];
  }

  public get hasNextEnemy(): boolean {
    return this.loop || this.current < this.dungeonItem.enemiesNumber - 1;
  }
  /**
   * Creates an instance of DungeonItemHandler.
   * @author Harper.Gao
   * @param {DungeonItem} dungeonItem Handle target
   * @param {boolean} loop Restart dungeon if set loop true after win the final enemy
   * @memberof DungeonItemHandler
   */
  constructor(private readonly dungeonItem: DungeonItem, private readonly loop: boolean = true) {
    makeAutoObservable(this);
  }

  public setCurrent = (value: number) => {
    this.current = value;
  };

  public findNextEnemy = (): EnemyItem | undefined => {
    if (this.hasNextEnemy) {
      this.current++;
      return this.currentEnemy;
    }

    if (this.loop) {
      this.current = 0;
      return this.currentEnemy;
    }

    return undefined;
  };
}

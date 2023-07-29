import { Master } from '@person';
import { Bank } from '@bank';
import { Backpack } from '@backpack';
import { Cook, Forge, Mining, Reiki } from '../fisher-modules/index.js';
import { Dungeon } from '@dungeon';
import { Battle } from '@battle';
import { Information } from '@information';

export type FisherComponent = Bank | Backpack | Mining | Reiki | Forge | Cook | Battle | Dungeon | Master | Information;

export type ActiveControlComponent = Mining | Reiki | Forge | Cook | Battle | Dungeon;

export type ComponentWithExperience = Mining | Reiki | Forge | Cook | Master;

export enum ComponentId {
  Bank = 'Bank',
  Backpack = 'Backpack',
  Mining = 'Mining',
  Reiki = 'Reiki',
  Forge = 'Forge',
  Cook = 'Cook',
  Battle = 'Battle',
  Dungeon = 'Dungeon',
  Master = 'Master',
  Information = 'Information',
}

import { Master } from '../fisher-person';
import { Bank } from '../fisher-bank';
import { Backpack } from '../fisher-backpack';
import { Cook, Forge, Mining, Reiki } from '../fisher-modules';
import { Dungeon } from '../fisher-dungeon';
import { Battle } from '../fisher-battle';
import { Information } from '../fisher-information';

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

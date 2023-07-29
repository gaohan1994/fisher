import { Battle } from '@battle';
import { Dungeon } from '@dungeon';
import { Cook, Forge, Mining, Reiki } from '../fisher-modules/index.js';
import { ComponentId, FisherComponent } from './Constants.js';

function isWithSkillComponent(component: FisherComponent): component is Mining | Reiki | Forge | Cook {
  return isMining(component) || isReiki(component) || isForge(component) || isCook(component);
}

function isMining(component: FisherComponent): component is Mining {
  return component.id === ComponentId.Mining;
}

function isReiki(component: FisherComponent): component is Reiki {
  return component.id === ComponentId.Reiki;
}

function isForge(component: FisherComponent): component is Forge {
  return component.id === ComponentId.Forge;
}

function isCook(component: FisherComponent): component is Cook {
  return component.id === ComponentId.Cook;
}

function isWithFightComponent(component: FisherComponent): component is Battle | Dungeon {
  return isBattle(component) || isDungeon(component);
}

function isBattle(component: FisherComponent): component is Battle {
  return component.id === ComponentId.Battle;
}

function isDungeon(component: FisherComponent): component is Dungeon {
  return component.id === ComponentId.Dungeon;
}

export { isWithSkillComponent, isMining, isReiki, isForge, isCook, isWithFightComponent, isBattle, isDungeon };

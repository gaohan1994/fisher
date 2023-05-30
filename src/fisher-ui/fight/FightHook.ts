import { Battle, Dungeon, Person, PersonMode, core } from '@FisherCore';
import { FuiColor } from '../theme';

const usePersonProgressValue = (person: Person) => {
  const hpProgressValue = (person.Hp / person.attributePanel.MaxHp) * 100;

  return {
    hpProgressValue,
    actionProgressValue: person.actionManager.attackActionTimer.progress,
  };
};

const useCurrentComponentActive = (fightComponent: Battle | Dungeon | undefined) => {
  return fightComponent !== undefined && core.activeComponentId === fightComponent.id;
};

const useFightComponentActions = (fightComponent: Battle | Dungeon | undefined) => {
  const stopFightComponent = () => {
    if (fightComponent === undefined) {
      return;
    }

    fightComponent.stop();
    core.componentManager.clearActiveComponent();
  };

  const executeFightComponentRewards = () => {
    if (fightComponent === undefined) {
      return;
    }

    fightComponent.executeRewards();
  };
  return {
    stopFightComponent,
    executeFightComponentRewards,
  };
};

const usePersonModeColor = (mode: PersonMode) => {
  if (mode === PersonMode.CommonEnemy) {
    return { color: FuiColor.primaryGreen };
  }

  if (mode === PersonMode.EliteEnemy) {
    return { color: FuiColor.primaryBlue };
  }

  if (mode === PersonMode.LegendaryEnemy) {
    return { color: FuiColor.priamryOrange };
  }

  return { color: FuiColor.common.white };
};

export { usePersonProgressValue, useCurrentComponentActive, useFightComponentActions, usePersonModeColor };

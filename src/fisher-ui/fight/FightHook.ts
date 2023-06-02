import { Battle, Dungeon, Person, core } from '@FisherCore';

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

export { usePersonProgressValue, useCurrentComponentActive, useFightComponentActions };

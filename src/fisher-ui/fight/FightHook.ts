import { Person } from '@FisherCore';

const usePersonProgressValue = (person: Person) => {
  const hpProgressValue = (person.Hp / person.attributePanel.MaxHp) * 100;

  return {
    hpProgressValue,
    actionProgressValue: person.actionManager.attackActionTimer.progress,
  };
};

export { usePersonProgressValue };

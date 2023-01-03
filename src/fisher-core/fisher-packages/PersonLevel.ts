import {
  GasRefiningEarly,
  GasRefiningMiddle,
  GasRefiningLater,
  PersonLevel,
  PersonLevelItem,
} from '../fisher-item';

export function generatePersonLevelData() {
  const gasRefiningEarly = new GasRefiningEarly();
  const gasRefiningMiddle = new GasRefiningMiddle();
  const gasRefiningLater = new GasRefiningLater();

  const personLevelMap = new Map<PersonLevel, PersonLevelItem>();
  personLevelMap.set(PersonLevel.GasRefiningEarly, gasRefiningEarly);
  personLevelMap.set(PersonLevel.GasRefiningMiddle, gasRefiningMiddle);
  personLevelMap.set(PersonLevel.GasRefiningLater, gasRefiningLater);

  return personLevelMap;
}

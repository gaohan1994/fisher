import { Person } from '@FisherCore';
import { VisiblePersonAttributeKeys } from './Constants';

/**
 * Return person visible attributes
 * @param person
 * @returns
 */
export const usePersonAttributes = (person: Person) => {
  const { attributePanel } = person;

  const attributes = VisiblePersonAttributeKeys.map((key) => ({
    key,
    value: attributePanel[key],
  }));

  return attributes;
};

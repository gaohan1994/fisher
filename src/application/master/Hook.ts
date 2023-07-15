import { useMaster } from '../core';

/**
 * Return master display name
 * @returns
 */
export const useMasterDisplayName = () => {
  const master = useMaster();
  return master.displayName;
};

/**
 * Return master person
 * @returns
 */
export const useMasterPerson = () => {
  const master = useMaster();
  return master.person;
};

/**
 * Return master experience
 * @returns
 */
export const useMasterExperience = () => {
  const master = useMaster();
  return master.person.experience;
};

import { useContext } from 'react';
import { CoreContext } from '../components';

export const useBank = () => {
  const core = useContext(CoreContext);
  return core.bank;
};

export const useBackpack = () => {
  const core = useContext(CoreContext);
  return core.backpack;
};

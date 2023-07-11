import { useContext } from 'react';
import { CoreContext } from '../components';

export const useCore = () => {
  const core = useContext(CoreContext);
  return core;
};

export const useBank = () => {
  const core = useContext(CoreContext);
  return core.bank;
};

export const useCart = () => {
  const bank = useBank();
  return bank.cart;
};

export const useBackpack = () => {
  const core = useContext(CoreContext);
  return core.backpack;
};

export const useBattle = () => {
  const core = useContext(CoreContext);
  return core.battle;
};

export const useMining = () => {
  const core = useContext(CoreContext);
  return core.mining;
};

export const useReiki = () => {
  const core = useContext(CoreContext);
  return core.reiki;
};

export const useForge = () => {
  const core = useContext(CoreContext);
  return core.forge;
};

export const useCook = () => {
  const core = useContext(CoreContext);
  return core.cook;
};

export const useDungeon = () => {
  const core = useContext(CoreContext);
  return core.dungeon;
};

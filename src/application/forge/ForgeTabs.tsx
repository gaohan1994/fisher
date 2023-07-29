import { FC } from 'react';
import { Tab, Tabs } from '@mui/material';
import { ForgeCategories, ForgeTabCategories } from './Constants';

interface ForgeTabsProps {
  activeTab: ForgeTabCategories;
  onChangeTab: (tab: ForgeTabCategories) => void;
}

const tabs = [ForgeCategories[0], ForgeCategories[1], ForgeCategories[2]];

export const ForgeTabs: FC<ForgeTabsProps> = ({ activeTab, onChangeTab }) => (
  <Tabs value={activeTab} onChange={(_, newTab) => onChangeTab(newTab)}>
    {tabs.map(({ key, name }) => (
      <Tab key={key} label={name} />
    ))}
  </Tabs>
);

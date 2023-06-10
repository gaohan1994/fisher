import { FC } from 'react';
import { Tab, Tabs } from '@mui/material';
import { ForgeRecipeTabCategory } from './ForgeCategory';
import { ForgeTabCategories } from './Constants';

interface IForgeRecipeTabs {
  tabs: ForgeRecipeTabCategory[];
  activeTab: ForgeTabCategories;
  onChangeTab: (tab: ForgeTabCategories) => void;
}
const ForgeRecipeTabs: FC<IForgeRecipeTabs> = ({ tabs, activeTab, onChangeTab }) => (
  <Tabs value={activeTab} onChange={(_, newTab) => onChangeTab(newTab)}>
    {tabs.map((tab) => (
      <Tab key={tab.category} label={tab.name} />
    ))}
  </Tabs>
);

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
const TabPanel: FC<TabPanelProps> = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`forge-tabpanel-${index}`}
    aria-labelledby={`forge-tab-${index}`}
    style={{ width: '100%' }}
    {...other}
  >
    {value === index && children}
  </div>
);

export { ForgeRecipeTabs, TabPanel };

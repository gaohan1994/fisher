import { FC } from 'react';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
export const TabPanel: FC<TabPanelProps> = ({ children, value, index, ...other }) => (
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

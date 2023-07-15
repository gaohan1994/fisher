import { Fragment } from 'react';
import { observer } from 'mobx-react';
import { Tab, Tabs } from '@mui/material';
import { FuiBackpackTabs, backpackStore } from './BackpackStore';
import { BackpackFullItemsTab } from './BackpackFullItemsTab';
import { BackpackEquipmentTab } from './BackpackEquipmentTab';

export const BackpackTabs = observer(() => {
  const { activeTab, setActiveBackpackTab } = backpackStore;

  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    setActiveBackpackTab(newValue as any);
  };

  return (
    <Fragment>
      <Tabs value={activeTab} onChange={handleChange} aria-label="wrapped label tabs example">
        <Tab value={FuiBackpackTabs.FullItems} label="全部" wrapped />
        <Tab value={FuiBackpackTabs.Equipments} label="装备" />
      </Tabs>
      {activeTab === FuiBackpackTabs.FullItems && <BackpackFullItemsTab />}
      {activeTab === FuiBackpackTabs.Equipments && <BackpackEquipmentTab />}
    </Fragment>
  );
});

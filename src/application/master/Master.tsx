import { FC, Fragment } from 'react';
import { observer } from 'mobx-react';
import { Avatar, CardHeader, Grid, Stack } from '@mui/material';
import { FuiPersonAttributePanel, FuiMasterHealPotionHandler, FuiExperienceDetail } from '@Fui';

import { PageBackpack } from '../backpack';
import { useMaster } from '../core';
import {
  CardHeaderText,
  FuiLevel,
  ItemPopoverVariant,
  ModuleCard,
  PersonAttributes,
  PersonEquipments,
} from '../components';
import { useMasterDisplayName, useMasterExperience, useMasterPerson } from './Hook';
import { MasterContainer } from './Styled';

const PageMaster: FC = observer(() => {
  const master = useMaster();
  const person = useMasterPerson();
  const experience = useMasterExperience();
  const name = useMasterDisplayName();
  return (
    <Fragment>
      <MasterContainer>
        <ModuleCard
          header={
            <CardHeader
              avatar={<Avatar src={master.media} />}
              title={
                <Stack direction="row">
                  <CardHeaderText sx={{ mr: 2 }}>{name}</CardHeaderText>
                  <FuiLevel experience={experience} />
                </Stack>
              }
            />
          }
        >
          <FuiExperienceDetail experience={experience} />
        </ModuleCard>
        <ModuleCard title="装备">
          <Grid container spacing={2}>
            <Grid item xs>
              <PersonEquipments person={person} variant={ItemPopoverVariant.Click} />
            </Grid>
            <Grid item xs>
              <PersonAttributes person={person} />
            </Grid>
            <Grid item xs>
              <FuiMasterHealPotionHandler />
            </Grid>
          </Grid>
        </ModuleCard>
      </MasterContainer>
      <PageBackpack />
    </Fragment>
  );
});

export { PageMaster };

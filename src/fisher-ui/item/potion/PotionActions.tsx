import React from 'react';
import { observer } from 'mobx-react';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { core, HealPotion, isHealPotion, PotionVariants } from '@FisherCore';
import { Button } from '@mui/material';

interface SetPotionSlotProps {
  potion: PotionVariants;
  actionCallback?: () => void;
}

const FuiSetPotionSlotButton: React.FC<SetPotionSlotProps> = observer(({ potion, actionCallback }) => {
  const { master } = core;

  const onSetPotionSlot = () => {
    actionCallback?.();

    if (isHealPotion(potion)) {
      onSetHealPotionSlot(potion);
    }
  };

  const onSetHealPotionSlot = (potion: HealPotion) => {
    // todo set heal potion slot
  };

  return (
    <Button onClick={onSetPotionSlot} variant="contained" color="success" startIcon={<VerifiedUserIcon />}>
      装备药水
    </Button>
  );
});

export { FuiSetPotionSlotButton };

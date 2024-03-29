import React from 'react';
import { observer } from 'mobx-react';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { BackpackItem, core, HealPotion, isHealPotion, Potion } from '@FisherCore';
import { Button } from '@mui/material';

interface SetPotionSlotProps {
  backpackItem: BackpackItem<Potion>;
  actionCallback?: () => void;
}

const FuiSetPotionSlotButton: React.FC<SetPotionSlotProps> = observer(({ backpackItem, actionCallback }) => {
  const { master } = core;

  const onSetPotionSlot = () => {
    actionCallback?.();

    if (isHealPotion(backpackItem.item)) {
      onSetHealPotionSlot(backpackItem as BackpackItem<HealPotion>);
    }
  };

  const onSetHealPotionSlot = (potion: BackpackItem<HealPotion>) => {
    master.healPotionHandler.setPotion(potion);
  };

  return (
    <Button onClick={onSetPotionSlot} variant="contained" color="success" startIcon={<VerifiedUserIcon />}>
      装备药水
    </Button>
  );
});

export { FuiSetPotionSlotButton };

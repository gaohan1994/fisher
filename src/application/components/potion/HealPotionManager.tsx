import { FC } from 'react';
import { observer } from 'mobx-react';
import { CardHeader } from '@mui/material';

import { useMasterPerson } from '../../master/Hook';
import { FuiItem, ItemPopoverVariant } from '../item';
import { PotionManagerCard } from './Styled';
import { useHealPotionHandler } from './Hook';
import { PotionDesc, PotionTip } from './Common';
import { Remove } from './Remove';

const ModuleTitle = '丹药';
const EmptyPotionText = '暂未装备药水';

/**
 * @note Only master allow to use potion
 * @returns
 */
export const HealPotionManager: FC = observer(() => {
  const person = useMasterPerson();
  const handler = useHealPotionHandler();
  return (
    <PotionManagerCard
      header={<CardHeader action={<Remove handler={handler} />} title={ModuleTitle} subheader={<PotionTip />} />}
    >
      <CardHeader
        sx={{ pt: 0 }}
        title={handler.potion?.item.name ?? EmptyPotionText}
        subheader={<PotionDesc potion={handler.potion?.item} />}
        avatar={
          handler.hasPotion ? (
            <FuiItem
              showQuantity
              item={handler.potion!.item as any}
              quantity={handler.potion!.quantity}
              variant={ItemPopoverVariant.None}
              onClick={() => handler.usePotion(person)}
            />
          ) : (
            <FuiItem item={handler.emptyPotion as any} variant={ItemPopoverVariant.MouseOver} />
          )
        }
      />
    </PotionManagerCard>
  );
});

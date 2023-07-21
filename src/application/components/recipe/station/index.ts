import { observer } from 'mobx-react';
import { Station as UnWrappedStation, StationProps } from './Station';
import { useStationHoc } from './empty';

const Station = observer(useStationHoc(UnWrappedStation));

export { Station };
export type { StationProps };

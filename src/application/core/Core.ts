import { observable } from 'mobx';
import { FisherCore } from '@FisherCore';

export const core = observable(FisherCore.create());

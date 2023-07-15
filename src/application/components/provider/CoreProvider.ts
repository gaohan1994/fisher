import { createContext } from 'react';
import { FisherCore } from '@FisherCore';

/**
 * Global context fisher core
 * @param {FisherCore} CoreContext
 */
export const CoreContext = createContext<FisherCore>(null as any);

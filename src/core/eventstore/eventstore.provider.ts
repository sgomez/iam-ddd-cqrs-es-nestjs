import { config } from '../../../config';
import { EventStore } from './eventstore.class';

export const eventStoreProviders = [
  {
    provide: 'EVENT_STORE_PROVIDER',
    useFactory: (eventStoreConfig?: any): any => {
      if (eventStoreConfig === 'EVENT_STORE_CONFIG_USE_ENV') {
        return new EventStore();
      }
    },
    inject: ['EVENT_STORE_CONFIG'],
  },
];

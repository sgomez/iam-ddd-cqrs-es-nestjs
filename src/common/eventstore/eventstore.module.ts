import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { eventstoreConfig } from 'config';

import { EventStoreProvider } from './eventstore.provider';

@Module({
  imports: [ConfigModule.forFeature(eventstoreConfig)],
  providers: [...EventStoreProvider],
  exports: [...EventStoreProvider],
})
export class EventStoreModule {}

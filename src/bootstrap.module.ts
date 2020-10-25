import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventSourcingModule } from 'event-sourcing-nestjs';

import { DatabaseModule } from './common/database/database.module';
import { EventStoreModule } from './common/eventstore/eventstore.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        `.env.${process.env.NODE_ENV}.local`,
        `.env.${process.env.NODE_ENV}`,
        '.env.local',
        '.env',
      ],
      isGlobal: true,
    }),
    DatabaseModule,
    EventSourcingModule.forRoot({ mongoURL: 'mongodb://localhost:27017/cqrs' }),
  ],
})
export class BootstrapModule {}

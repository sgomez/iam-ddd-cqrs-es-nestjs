import { EventStoreModule } from '@aulasoftwarelibre/nestjs-eventstore';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { ConsoleModule } from 'nestjs-console';

import configuration from './config/configuration';

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
      load: [configuration],
    }),
    ConsoleModule,
    CqrsModule,
    EventStoreModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        category: configService.get('eventstore.category'),
        connection: configService.get('eventstore.connection'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class BootstrapModule {}

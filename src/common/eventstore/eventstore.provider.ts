import { DynamicModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventSourcingModule } from 'event-sourcing-nestjs';

export const EventStoreProvider = [
  {
    provide: EventSourcingModule,
    useFactory: async (config: ConfigService): Promise<DynamicModule> =>
      await EventSourcingModule.forRoot({
        mongoURL: config.get('eventstore').url,
      }),
    inject: [ConfigService],
  },
];

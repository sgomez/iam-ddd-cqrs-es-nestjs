import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { EventSourcingModule } from 'event-sourcing-nestjs';
import { DatabaseModule } from 'src/common/database';

import { CommandHandlers } from '../application/command';
import { ScopeController } from './controller/scope.controller';
import { ScopeEventStore } from './eventstore';
import { ProjectionHandlers } from './read-model/projection';
import { ScopeProviders } from './scope.providers';
import { ScopeService } from './service/scope.service';

@Module({
  controllers: [ScopeController],
  imports: [CqrsModule, DatabaseModule, EventSourcingModule.forFeature()],
  providers: [
    ...CommandHandlers,
    ...ProjectionHandlers,
    ...ScopeProviders,
    ScopeService,
    ScopeEventStore,
  ],
})
export class ScopeModule {}

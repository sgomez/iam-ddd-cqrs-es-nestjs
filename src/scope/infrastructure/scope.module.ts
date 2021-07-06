import { Event, EventStoreModule } from '@aulasoftwarelibre/nestjs-eventstore';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { DatabaseModule } from '../../core/database/database.module';
import { CommandHandlers } from '../application/command';
import { CreateScopeDto } from '../application/dto/request/create-scope.dto';
import { RemoveScopeDto } from '../application/dto/request/remove-scope.dto';
import {
  DomainEvents,
  ScopeWasCreated,
  ScopeWasRemoved,
  ScopeWasRenamed,
} from '../domain/event';
import { Scope } from '../domain/model';
import { ScopeController } from './controller/scope.controller';
import { RenameScopeDto } from './dto';
import { ProjectionHandlers } from './read-model/projection';
import { ScopeProviders } from './scope.provider';
import { ScopeService } from './service/scope.service';

@Module({
  controllers: [ScopeController],
  imports: [
    CqrsModule,
    DatabaseModule,
    EventStoreModule.forFeature([Scope], {
      ScopeWasCreated: (event: Event<CreateScopeDto>) =>
        new ScopeWasCreated(
          event.payload.id,
          event.payload.name,
          event.payload.alias,
        ),
      ScopeWasRenamed: (event: Event<RenameScopeDto>) =>
        new ScopeWasRenamed(event.payload.id, event.payload.name),
      ScopeWasRemoved: (event: Event<RemoveScopeDto>) =>
        new ScopeWasRemoved(event.payload.id),
    }),
  ],
  providers: [
    ...CommandHandlers,
    ...DomainEvents,
    ...ProjectionHandlers,
    ...ScopeProviders,
    ScopeService,
  ],
})
export class ScopeModule {}

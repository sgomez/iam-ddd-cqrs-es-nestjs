import { Event, EventStoreModule } from '@aulasoftwarelibre/nestjs-eventstore';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';

import { CommandHandlers, QueryHandlers } from '../application';
import {
  DomainEvents,
  Scope,
  ScopeWasCreated,
  ScopeWasRemoved,
  ScopeWasRenamed,
} from '../domain';
import { CreateScopeDto, RemoveScopeDto, RenameScopeDto } from '../dto';
import { ScopeController } from './controller/scope.controller';
import {
  ProjectionHandlers,
  SCOPES_PROJECTION,
  ScopeSchema,
} from './read-model';
import { ScopeProviders } from './scope.provider';
import { ScopeService } from './service';

@Module({
  controllers: [ScopeController],
  imports: [
    CqrsModule,
    EventStoreModule.forFeature([Scope], {
      ScopeWasCreated: (event: Event<CreateScopeDto>) =>
        new ScopeWasCreated(
          event.payload._id,
          event.payload.name,
          event.payload.alias,
        ),
      ScopeWasRenamed: (event: Event<RenameScopeDto>) =>
        new ScopeWasRenamed(event.payload._id, event.payload.name),
      ScopeWasRemoved: (event: Event<RemoveScopeDto>) =>
        new ScopeWasRemoved(event.payload._id),
    }),
    MongooseModule.forFeature([
      {
        name: SCOPES_PROJECTION,
        schema: ScopeSchema,
      },
    ]),
  ],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    ...DomainEvents,
    ...ProjectionHandlers,
    ...ScopeProviders,
    ScopeService,
  ],
})
export class ScopeModule {}

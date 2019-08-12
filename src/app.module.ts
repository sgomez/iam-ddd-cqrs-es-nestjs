import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';

import { EventStoreModule } from './core/eventstore/eventstore.module';
import { ScopeModule } from './scope/scope.module';

@Module({
  imports: [
    EventStoreModule.forRoot(),
    MongooseModule.forRoot('mongodb://localhost/iam'),
    ScopeModule,
    CqrsModule,
  ],
})
export class AppModule {}

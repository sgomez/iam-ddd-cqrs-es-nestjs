import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { databaseConfig } from 'config';

import { DatabaseProvider } from './database.provider';

@Module({
  imports: [ConfigModule.forFeature(databaseConfig)],
  providers: [...DatabaseProvider],
  exports: [...DatabaseProvider],
})
export class DatabaseModule {}

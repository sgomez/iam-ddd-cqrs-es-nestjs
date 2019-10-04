import { Global, Module } from '@nestjs/common';

import { BootstrapModule } from './bootstrap.module';
import { ScopeModule } from './scope/scope.module';

@Global()
@Module({
  imports: [BootstrapModule, ScopeModule],
})
export class AppModule {}

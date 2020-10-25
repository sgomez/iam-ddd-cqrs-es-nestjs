import { DynamicModule } from '@nestjs/common';

import { BootstrapModule } from './bootstrap.module';
import { ScopeModule } from './scope/infrastructure/scope.module';

export class AppModule {
  static forRoot(): DynamicModule {
    return {
      module: this,
      imports: [BootstrapModule, ScopeModule],
    };
  }
}

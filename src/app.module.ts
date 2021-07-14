import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { AppLoggerMiddleware } from './app.middleware';
import { BootstrapModule } from './bootstrap.module';
import { ScopeModule } from './scope/infrastructure/scope.module';

@Module({
  imports: [BootstrapModule, ScopeModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}

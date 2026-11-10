import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { HealthController } from './health.controller';
import { NotesController } from './notes/notes.controller';
import { AuthController } from './auth/auth.controller';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { RequestIdMiddleware } from './common/middleware/request-id.middleware';
import { NotesModule } from './notes/notes.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [UsersModule, AuthModule, NotesModule],
  controllers: [HealthController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    // Order matters: RequestIdMiddleware must run before LoggerMiddleware.
    consumer
      .apply(RequestIdMiddleware, LoggerMiddleware)
      .forRoutes(AuthController, NotesController);
  }
}

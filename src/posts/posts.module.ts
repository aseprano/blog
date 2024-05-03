import { ConsoleLogger, Logger, Module, Scope } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsApplicationService } from '../domain/app_services/PostsApplicationService';
import { createConnection } from 'mysql2';
import { MySQLPostsRepository } from '../domain/repositories/impl/MySQLPostsRepository';
import { DBConnection } from '../service/impl/DBConnection';
import { EventDispatcher } from '../service/EventDispatcher';
import { EventDispatcherLoggerDecorator } from '../service/impl/EventDispatcherLoggerDecorator';
import { NullEventDispatcher } from '../service/impl/NullEventDispatcher';
import * as process from 'node:process';

@Module({
  providers: [
    {
      provide: Logger,
      useClass: ConsoleLogger,
    },
    {
      provide: EventDispatcher,
      inject: [Logger],
      useFactory: (logger: Logger) => {
        return new EventDispatcherLoggerDecorator(
          new NullEventDispatcher(),
          logger,
        );
      }
    },
    {
      provide: PostsApplicationService,
      inject: [EventDispatcher],
      useFactory: (eventDispatcher: EventDispatcher) => {
        const conn = createConnection({
          host: process.env.MYSQL_HOST,
          user: process.env.MYSQL_USER,
          password: process.env.MYSQL_PASSWORD,
          database: process.env.MYSQL_SCHEMA,
        });

        return new PostsApplicationService(
          new MySQLPostsRepository(new DBConnection(conn)),
          eventDispatcher,
        );
      },
      scope: Scope.REQUEST,
    },
  ],
  controllers: [PostsController],
})
export class PostsModule {}

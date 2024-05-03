import { ConsoleLogger, Logger, Module, Scope } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsManagementService } from '../domain/app_services/PostsManagementService';
import { createConnection } from 'mysql2';
import { MySQLPostsRepository } from '../domain/repositories/impl/MySQLPostsRepository';
import { DBConnection } from '../service/impl/DBConnection';
import { EventDispatcher } from '../service/EventDispatcher';
import { EventDispatcherLoggerDecorator } from '../service/impl/EventDispatcherLoggerDecorator';
import { NullEventDispatcher } from '../service/impl/NullEventDispatcher';
import * as process from 'node:process';
import { BlogSearchService } from '../domain/app_services/BlogSearchService';
import { Connection } from 'mysql2/typings/mysql/lib/Connection';

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
      provide: DBConnection,
      scope: Scope.REQUEST,
      useFactory: () => {
        const conn = createConnection({
          host: process.env.MYSQL_HOST,
          user: process.env.MYSQL_USER,
          password: process.env.MYSQL_PASSWORD,
          database: process.env.MYSQL_SCHEMA,
        });

        return new DBConnection(conn);
      },
    },
    {
      provide: PostsManagementService,
      inject: [EventDispatcher, DBConnection],
      useFactory: (eventDispatcher: EventDispatcher, connection: DBConnection) => {
        return new PostsManagementService(
          new MySQLPostsRepository(connection),
          eventDispatcher,
        );
      },
    },
    {
      provide: BlogSearchService,
      inject: [DBConnection],
      useFactory: (connection: DBConnection) => {
        return new BlogSearchService(connection);
      },
    }
  ],
  controllers: [PostsController],
})
export class PostsModule {}

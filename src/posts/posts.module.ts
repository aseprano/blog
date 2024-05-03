import { ConsoleLogger, Logger, Module, Scope } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsApplicationService } from '../domain/app_services/PostsApplicationService';
import { createConnection } from 'mysql2';
import * as process from 'node:process';
import { MySQLPostsRepository } from '../domain/repositories/impl/MySQLPostsRepository';
import { DBConnection } from '../service/impl/DBConnection';

@Module({
  providers: [
    {
      provide: Logger,
      useClass: ConsoleLogger,
    },
    {
      provide: PostsApplicationService,
      useFactory: () => {
        const conn = createConnection({
          host: process.env.MYSQL_HOST,
          user: process.env.MYSQL_USER,
          password: process.env.MYSQL_PASSWORD,
          database: process.env.MYSQL_SCHEMA,
        });

        return new PostsApplicationService(
          new MySQLPostsRepository(new DBConnection(conn)),
        );
      },
      scope: Scope.REQUEST,
    },
  ],
  controllers: [PostsController],
})
export class PostsModule {}

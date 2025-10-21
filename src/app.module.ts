import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodoModule } from './todo/todo.module';
import { PrismaModule } from './prisma/prisma.module';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    TodoModule,
    PrismaModule,
    CacheModule.register({
      store: redisStore,
      url: 'redis://localhost:6379',
      isGlobal: true, // Makes cache available everywhere
      ttl: 30, // Default TTL 30 seconds
      port: 6379,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

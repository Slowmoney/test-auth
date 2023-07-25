import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { getConnectionOptions } from 'typeorm';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/entities/user.entity';
import configSchema from './config.schema';
import { NewsModule } from './news/news.module';
import { News } from './news/entities/news.entity';

@Module({
  imports: [
    NewsModule,
    AuthModule,
    TypeOrmModule.forRootAsync({
      useFactory: async () =>
        Object.assign(await getConnectionOptions(), {
          synchronize: true,
          entities: [User, News],
        } as TypeOrmModuleOptions),
    }),
    ConfigModule.forRoot({ validationSchema: configSchema }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { getConnectionOptions } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/entities/user.entity';
import configSchema from './config.schema';
import { NewsModule } from './news/news.module';

@Module({
  imports: [
    NewsModule,
    AuthModule,
    TypeOrmModule.forRootAsync({
      useFactory: async () =>
        Object.assign(await getConnectionOptions(), {
          autoLoadEntities: true,
          synchronize: true,
          entities: [User],
          database: 'user',
        } as TypeOrmModuleOptions),
    }),
    ConfigModule.forRoot({ validationSchema: configSchema }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

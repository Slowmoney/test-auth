import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NewsModule } from './news/news.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [NewsModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

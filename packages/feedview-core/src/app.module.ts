import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MainEvents } from './main-events/main-events.module';
import configuration from './config/configuration';
import { ScheduleModule } from '@nestjs/schedule';
import { TwitterModule } from './twitter/twitter.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    ScheduleModule.forRoot(),
    MainEvents,
    TwitterModule,
  ],
})
export class AppModule {}

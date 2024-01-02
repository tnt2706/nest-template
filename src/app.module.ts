import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RouterModule, Routes } from 'nest-router';
import { configSettings, SMTPConfig, staticConfig, TypeORMConfig } from './config/configuration';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MailerModule } from 'nestjs-mailer';
import { BaseModule } from './modules/base/base.module';
import { ApiModule } from './modules/api/api.module';

const routes: Routes = [
  {
    path: '',
    module: ApiModule,
  }
];

@Module({
  imports: [
    ConfigModule.forRoot(configSettings),
    TypeOrmModule.forRootAsync(TypeORMConfig),
    RouterModule.forRoutes(routes),
    ServeStaticModule.forRoot(staticConfig),
    MailerModule.forRoot(SMTPConfig),
    BaseModule,
    ApiModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

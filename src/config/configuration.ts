import { RequestMethod } from "@nestjs/common";
import { RouteInfo } from "@nestjs/common/interfaces/middleware";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ConfigModuleOptions } from "@nestjs/config/dist/interfaces";
import { ServeStaticModuleOptions } from "@nestjs/serve-static";
import { TypeOrmModuleAsyncOptions } from "@nestjs/typeorm";
import { MailerModuleOptions } from "nestjs-mailer";
import { join } from "path";
import * as dotenv from "dotenv";
import { ConnectionOptions } from "typeorm";
dotenv.config({ path: process.env.PWD + '/.env' });

export const publicRoutes: RouteInfo[] = [
  { path: 'auth/register', method: RequestMethod.POST },
  { path: 'auth/login', method: RequestMethod.POST },
  { path: 'auth/active', method: RequestMethod.GET },
  { path: 'auth/token', method: RequestMethod.POST },
  { path: 'auth/password/reset', method: RequestMethod.POST },
  { path: 'auth/password/reset', method: RequestMethod.GET },
];

export const configSettings: ConfigModuleOptions = {
  isGlobal: true,
  load: [],
};

export const staticConfig: ServeStaticModuleOptions = {
  rootPath: join(__dirname, '..', 'public'),
};

export const TypeORMConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    autoLoadEntities: true,
    entities: [__dirname + '/**/entities/*.entity{.ts,.js}'],
    synchronize: false,
  }),
};

export const SMTPConfig: MailerModuleOptions = {
  config: {
    transport: {
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: JSON.parse(process.env.SMTP_SECURE),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    },
    defaults: {
      from: 'process.env.FROM_NAME <process.env.FROM_EMAIL>',
    },
  },
};

// Check typeORM documentation for more information.
export const ormconfig: ConnectionOptions & { seeds: string[], factories: string[]; } = {
  type: 'postgres',
  url: process.env.DATABASE_URL || '',
  synchronize: false,
  logging: true,
  logger: "advanced-console",
  entities: [
    "src/modules/api/entities/*.ts"
  ],
  migrations: [
    "src/db/migration/**/*.ts"
  ],
  cli: {
    "entitiesDir": "src/modules/api/entities",
    "subscribersDir": "src/modules/api/subscribers",
    "migrationsDir": "src/db/migration"
  },
  seeds: ["src/db/seeding/seeds/**/*{.ts,.js}"],
  factories: ["src/db/seeding/factories/**/*{.ts,.js}"]
};
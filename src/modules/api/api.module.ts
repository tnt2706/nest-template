// Import all external helpers here
import _ = require('lodash');
// ----------------------------------

// Import nestjs modules here
import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';

import { 
  TypeOrmModule 
} from '@nestjs/typeorm';
// ----------------------------------

// Import our modules here
import { 
  BaseModule 
} from '@base/base.module';
// ----------------------------------

// Controllers
import * as controllers from '@api/controllers';

// Services
import * as services from '@api/services';

// Entities
import * as entities from '@api/entities';

// Validators
// import * as validators from '@api/validators';

// Middlewares
import * as middlewares from '@api/middlewares';

// All routes here
import { publicRoutes } from '~/config/configuration';

@Module({
  imports: [
    BaseModule, // to allow this module can used the infrastructure service
    TypeOrmModule.forFeature(_.values(entities)),
  ],
  controllers: [
    ..._.values(controllers),
  ],
  providers: [
    ..._.values(services),
  ],
})
export class ApiModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {

    consumer
      .apply(middlewares.AuthMiddleware)
      .exclude(...publicRoutes)
      .forRoutes({ path: 'auth', method: RequestMethod.ALL });
  }
}

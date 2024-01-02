// Import all external helpers here
import _ = require('lodash');
// ----------------------------------

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// Services
import * as services from '@base/services';

@Module({
  imports: [ConfigModule],
  providers: [
    ..._.values(services),
  ],
  exports: [
    ConfigModule,
    ..._.values(services),
  ]
})
export class BaseModule {}

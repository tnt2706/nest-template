import { Logger } from '@nestjs/common';
import { ClassTransformOptions } from '@nestjs/common/interfaces/external/class-transform-options.interface';
import { plainToClass } from 'class-transformer';
import { ClassType } from 'class-transformer/ClassTransformer';
import _ = require('lodash');
import md5 = require('md5');
import moment = require('moment');
import { EncryptHelper, StringHelper } from '~/modules/base/helpers';

export class CommonService {
  constructor(
  ) { }
  /**
   * Hash password
   * 
   * @param {string} password
   */
  static async hashPassword(password: string) {
    return EncryptHelper.hash(password);
  }

  /**
   * Generate password
   * 
   */
  static async generatePassword() {
    return EncryptHelper.hash(StringHelper.randomPassword(8));
  }

  /**
   * Generate password reset code
   * @param  {string} serect
   * @returns string
   */
  static generatePasswordResetCode(serect: string) {
    return String(md5(`${serect}${StringHelper.randomString(8)}`));
  }

  /**
   * Generate password reset expiration time
   * @param  {number} minutes
   * @returns number
   */
  static generateExpirationTime(minutes: number) {
    Logger.log(minutes);
    return Number(
      moment()
        .add(minutes, 'minutes')
        .format('x'),
    );
  }

  /**
   * Generate activation code with 8 characters
   * @param  {number} length
   * @returns string
   */
  static generateActivationCode(length: number = 8): string {
    return StringHelper.randomString(length);
  }
}

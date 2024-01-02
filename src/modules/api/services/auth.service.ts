import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EncryptHelper, ErrorHelper } from '@base/helpers';
import { Auth } from '@api/entities';
import {
  AuthActiveRequestDTO,
  AuthCreatePasswordResetRequestDTO,
  AuthGetPasswordResetRequestDTO,
  AuthLoginRequestDTO,
  AuthLoginResponseDTO,
  AuthLogoutRequestDTO,
  AuthRefreshTokenRequestDTO,
  AuthRefreshTokenResponseDTO,
  AuthRegisterRequestDTO,
  AuthUpdatePasswordResetRequestDTO,
} from '@api/dtos';
import { IAuthRequest } from '@api/interfaces';
import { EntityManager, Repository } from 'typeorm';
import { parallel, reflectAll } from 'async';
import { CommonService, EmailService, JWTService } from '@base/services';
import { AuthStatusEnum } from '../enums';
import { pullAt } from 'lodash';
import _ = require('lodash');

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
    @Inject('EmailService')
    private readonly emailService: EmailService,
    @Inject('JWTService')
    private readonly jwtService: JWTService
  ) {}

  /**
   * Register new auth
   * @param  {AuthRegisterRequestDTO} payload
   */
  async register(payload: AuthRegisterRequestDTO, manager: EntityManager) {
    let auth = new Auth(payload);
    if ((auth = await manager.save(auth))) {
      // Send email activation to user
      const { token } = await this.jwtService.generateAccountActiveAccessToken(auth);
      await this.emailService.sendEmailActive({
        id: auth.id,
        email: auth.email,
        token: token,
      });

      return auth;
    }
    ErrorHelper.InternalServerErrorException('System Error');
  }

  /**
   * Active user by email
   * @param  {AuthActiveRequestDTO} payload
   */
  async active(payload: AuthActiveRequestDTO) {
    const tokenPayload = await this.jwtService.verifyAccountActiveAccessToken(payload.token);
    if (!tokenPayload || !tokenPayload.id || !payload.id || tokenPayload.id !== payload.id) {
      ErrorHelper.BadRequestException('auth.accessToken.invalid');
    }
    // ----------------------------------------------------
    const auth = await this.authRepository.findOne(tokenPayload.id);
    if (auth.status === AuthStatusEnum.ACTIVE) {
      ErrorHelper.BadRequestException('auth.status.activated');
    }

    auth.status = AuthStatusEnum.ACTIVE;
    const updatedRS = await this.authRepository.update(auth.id, {
      status: AuthStatusEnum.ACTIVE,
    });

    if (updatedRS) {
      // Send Welcome email here.
      // await this.emailService.sendWelcomeEmail(auth);

      // Generate accessToken
      const tokens = await this.jwtService.generatedTokens(auth);
      return { ...tokens, auth };
    } else {
      // Log error
      ErrorHelper.InternalServerErrorException('auth.active.invalid');
    }
  }

  /**
   * Login to the app
   * @param  {AuthLoginRequestDTO} payload
   */
  async login(payload: AuthLoginRequestDTO) {
    const response = new AuthLoginResponseDTO();
    const auth = await this.authRepository.findOne({ email: payload.email });

    if (!auth) {
      ErrorHelper.NotFoundException('auth.object.not_found.');
    }

    if (auth.status !== AuthStatusEnum.ACTIVE) {
      ErrorHelper.BadRequestException('auth.status.inactive');
    }

    // Validate password
    const validPassword = await EncryptHelper.compare(payload.password, auth.password);
    if (!validPassword) {
      ErrorHelper.BadRequestException('auth.password.invalid');
    }

    // Generate accessToken and refreshToken here
    const tokenData = await this.jwtService.generatedTokens(auth);

    // Save loginToken
    this.assignLoginToken(auth, tokenData.accessToken);

    // Save fcmToken
    this.assignFCMToken(auth, payload.fcmToken);

    // Update to DB
    await auth.save();

    // Merge token information and auth information
    Object.assign(response, { ...tokenData, auth });

    return response;
  }

  /**
   * Re-create accessToken base on the refreshToken instead of login again
   * @param  {AuthRefreshTokenResponseDTO} payload
   */
  async refreshToken(payload: AuthRefreshTokenRequestDTO) {
    const response = new AuthRefreshTokenResponseDTO();

    // Validate authId before using it.
    const auth = await this.authRepository.findOne(payload.id);
    if (!auth) {
      ErrorHelper.NotFoundException('auth.object.not_found.');
    }
    if (auth.status !== AuthStatusEnum.ACTIVE) {
      ErrorHelper.BadRequestException('auth.status.inactive');
    }

    // Validate refreshToken and create new accessToken
    const tokenData = await this.jwtService.refreshAccessToken(auth, payload.refreshToken);

    // Save loginToken
    await this.unassignExpiredTokens(auth);
    this.assignLoginToken(auth, tokenData.token);

    // Update to DB
    await auth.save();

    // Merge token information and ...
    Object.assign(response, { ...tokenData });

    return response;
  }

  /**
   * User input their email and request change password for that account
   * @param  {AuthCreatePasswordResetRequestDTO} payload
   */
  async createPasswordReset(payload: AuthCreatePasswordResetRequestDTO) {
    // Validate Password Reset information
    const auth = await this.authRepository.findOne({ email: payload.email });
    if (!auth) {
      ErrorHelper.BadRequestException('auth.object.not_found');
    }

    // Generate token send to user to authorise request change password
    const { token } = await this.jwtService.generatePasswordResetAccessToken(auth);
    await this.emailService.sendEmailPasswordReset({
      id: auth.id,
      email: auth.email,
      token: token,
    });
    return true;
  }

  /**
   * Check token with reset password information is valid or not
   * @param  {AuthGetPasswordResetRequestDTO} payload
   */
  async getPasswordReset(payload: AuthGetPasswordResetRequestDTO) {
    const tokenPayload = await this.jwtService.verifyPasswordResetAccessToken(payload.token);
    if (!tokenPayload || !tokenPayload.id || !payload.id || tokenPayload.id !== payload.id) {
      ErrorHelper.BadRequestException('auth.accessToken.invalid');
    }
    // Generate accessToken and save to DB
    const auth = await this.authRepository.findOne(tokenPayload.id);
    return await this.jwtService.generatedTokens(auth);
  }

  /**
   * User update their password with valid accessToken
   * @param  {IAuthRequest} req
   * @param  {AuthUpdatePasswordResetRequestDTO} payload
   */
  async updatePasswordReset(req: IAuthRequest, payload: AuthUpdatePasswordResetRequestDTO) {
    payload.password = await CommonService.hashPassword(payload.password);
    await this.authRepository.update(req.tokenPayload.id, { password: payload.password });
    return true;
  }

  /**
   * Logout the auth and do some actions on auth signout.
   * @param  {IAuthRequest} req
   * @param  {AuthLogoutRequestDTO} payload
   */
  async logout(req: IAuthRequest, payload: AuthLogoutRequestDTO) {
    const { fcmToken, logoutAllDevices = false } = payload;
    const { accessToken = '', tokenPayload = null } = req;

    if (!tokenPayload || !accessToken) {
      return true; // Passed
    }

    const auth = await this.authRepository.findOne(tokenPayload.id);

    if (!auth) {
      return true; // Passed
    }
    if (logoutAllDevices) {
      // Logout all logged in devices
      auth.loggingTokens = [];
      auth.fcmTokens = [];
    } else {
      this.unassignLoginToken(auth, accessToken);
      await this.unassignExpiredTokens(auth);
      this.unassignFCMToken(auth, fcmToken);
    }

    // Update again loggingTokens and fcmTokens to DB
    await this.authRepository.update(auth.id, {
      loggingTokens: auth.loggingTokens,
      fcmTokens: auth.fcmTokens,
    });

    return true;
  }

  /**
   * Assign the accessToken to the loggingTokens
   * @param  {Auth} auth
   * @param  {string} token
   */
  private assignLoginToken(auth: Auth, token: string) {
    if (token) {
      if (!auth.loggingTokens) {
        auth.loggingTokens = [token];
      } else if (!auth.loggingTokens.includes(token)) {
        auth.loggingTokens.push(token);
      }
    }
  }

  /**
   * Unassign the accessToken from the loggingTokens
   * @param  {Auth} auth
   * @param  {string} token
   */
  private unassignLoginToken(auth: Auth, token: string) {
    if (auth && auth.loggingTokens && token && auth.loggingTokens.includes(token)) {
      _.pull(auth.loggingTokens, token);
    }
  }

  /**
   * Unassign the expired accessTokens from the loggingTokens
   * @param  {Auth} auth
   * @param  {string} token
   */
  private async unassignExpiredTokens(auth: Auth) {
    if (auth && auth.loggingTokens) {
      const tasks = [];
      for (const token of auth.loggingTokens) {
        tasks.push(this.jwtService.verifyAccessToken.bind(null, token));
      }
      const idxToRemove = [];
      const results = await parallel(reflectAll(tasks));
      results.forEach((result: any, idx: number) => {
        if (!result.value) {
          idxToRemove.push(idx);
        }
      });

      pullAt(auth.loggingTokens, idxToRemove);
    }
  }

  /**
   * Assign the fcmToken to the fcmTokens
   * @param  {Auth} auth
   * @param  {string} token
   */
  private assignFCMToken(auth: Auth, token: string) {
    if (token) {
      if (!auth.fcmTokens) {
        auth.fcmTokens = [token];
      } else if (!auth.fcmTokens.includes(token)) {
        auth.fcmTokens.push(token);
      }
    }
  }

  /**
   * Unassign the fcmToken from the fcmTokens
   * @param  {Auth} auth
   * @param  {string} token
   */
  private unassignFCMToken(auth: Auth, token: string) {
    if (auth && auth.fcmTokens && token && auth.fcmTokens.includes(token)) {
      _.pull(auth.fcmTokens, token);
    }
  }
}

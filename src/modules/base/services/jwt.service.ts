import { Injectable } from '@nestjs/common';
import { ErrorHelper, TokenHelper } from '@base/helpers';
import { classToPlain } from 'class-transformer';
import { Auth } from '@api/entities';
import { TokenPayload } from '@api/interfaces';
import { TokenExpiredError } from "jsonwebtoken";

@Injectable()
export class JWTService {
  constructor() { }
  
  /**
   * Verify Access Token
   * @param  {string} token
   */
  async verifyAccessToken(token: string) {
    return this.verifyToken(token, process.env.TOKEN_SECRET);
  }
  
  /**
   * Verify Refresh Token
   * @param  {string} token
   */
  async verifyRefreshToken(token: string) {
    return this.verifyToken(token, process.env.REFRESH_TOKEN_SECRET);
  }

  /**
   * Verify token string and extract data from it
   * @param  {string} token
   * @param  {string} secrect
   */
  async verifyToken(token: string, secrect: string) {
    try {
      return await TokenHelper.verify<TokenPayload>(token, secrect);
    } catch(error) {
      if (error instanceof TokenExpiredError) {
        ErrorHelper.UnauthorizedException('auth.token.expired');
      }
      ErrorHelper.BadRequestException('auth.token.invalid');
    }
  }

  /**
   * Create the accessToken to active account
   * @param auth object of Auth
   * @returns { token, expires } | NotFoundException
   */
  async generateAccountActiveAccessToken(auth: Auth): Promise<any> {
    return TokenHelper.generate(
      classToPlain(auth),
      process.env.ACTIVE_ACCOUNT_SECRET,
      process.env.ACTIVE_ACCOUNT_TOKEN_EXPIRES,
    );
  }

  /**
   * Verify the accessToken to active account
   * @param token string
   * @returns { token, expires } | NotFoundException
   */
  async verifyAccountActiveAccessToken(token: string): Promise<any> {
    return this.verifyToken(token, process.env.ACTIVE_ACCOUNT_SECRET);
  }

  /**
   * Create the accessToken to update password
   * @param auth object of Auth
   * @returns { token, expires } | NotFoundException
   */
  async generatePasswordResetAccessToken(auth: Auth): Promise<any> {
    return TokenHelper.generate(
      classToPlain(auth),
      process.env.RESET_PASSWORD_SECRET,
      process.env.RESET_PASSWORD_TOKEN_EXPIRES,
    );
  }

  /**
   * Verify the accessToken to update password
   * @param token string
   * @returns { token, expires } | NotFoundException
   */
  async verifyPasswordResetAccessToken(token: string): Promise<any> {
    return this.verifyToken(token, process.env.RESET_PASSWORD_SECRET);
  }

  /**
   * Refresh the accessToken
   * @param auth object of Auth
   * @param refreshToken string
   * @returns { token, expires } | NotFoundException
   */
  async refreshAccessToken(auth: Auth, refreshToken: string = ''): Promise<any> {
    const tokenPayload = await this.verifyRefreshToken(refreshToken);
    if (!tokenPayload || !tokenPayload.id || !auth.id || tokenPayload.id !== auth.id) {
      return ErrorHelper.NotFoundException('auth.token.invalid');
    }
    return TokenHelper.generate(
      classToPlain(auth),
      process.env.TOKEN_SECRET,
      process.env.TOKEN_EXPIRES,
    );
  }

  /**
   * Generate:
   *   - accessToken: To access to our service.
   *   - refreshToken: To refesh the accessToken.
   * @param auth object of Auth
   */
  async generatedTokens(auth: Auth) {
    const promises = [];

    promises.push(
      TokenHelper.generate(
        classToPlain(auth),
        process.env.TOKEN_SECRET,
        process.env.TOKEN_EXPIRES,
      ),
    );

    promises.push(
      TokenHelper.generate(
        classToPlain(auth),
        process.env.REFRESH_TOKEN_SECRET,
        process.env.REFRESH_TOKEN_EXPIRES,
      ),
    );

    const [accessToken, refreshToken] = await Promise.all(promises);

    return {
      accessToken: accessToken.token,
      accessTokenExpires: accessToken.expires * 1000, // convert from seconds to miliseconds
      refreshToken: refreshToken.token,
      refreshTokenExpires: refreshToken.expires * 1000, // convert from seconds to miliseconds
    };
  }
}

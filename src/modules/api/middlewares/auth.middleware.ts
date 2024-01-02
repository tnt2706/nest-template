import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { AuthService } from '@api/services';
import { ErrorHelper } from '@base/helpers';
import { IAuthRequest } from '@api/interfaces';
import { JWTService } from '@base/services';
import { TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JWTService) {}

  async use(req: IAuthRequest, res: any, next: () => void) {
    const { headers = {} } = req;
    if (!headers.authorization) {
      ErrorHelper.UnauthorizedException('auth.token.missing');
    }
    const accessToken = headers.authorization.split(' ')[1] || '';
    let tokenPayload = null;
    try {
      tokenPayload = await this.jwtService.verifyAccessToken(accessToken);
      if (!tokenPayload) {
        // TODO: re-check if we can remove this check
        ErrorHelper.BadRequestException('auth.token.invalid');
      }
      req.tokenPayload = tokenPayload;
      req.accessToken = accessToken;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        ErrorHelper.UnauthorizedException('auth.token.expired');
      }
      Logger.error('AuthMiddleware', error);
    }
    next();
  }
}

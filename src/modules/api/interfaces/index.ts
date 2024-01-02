import { Request } from 'express';

export interface TokenPayload {
  iat: number,
  exp: number,
  id: string,
  email: string,
  status: string,
  timezoneName: string,
}

export interface IBaseRequest extends Request {
  accessToken: string;
}

export interface IAuthRequest extends IBaseRequest {
  tokenPayload: TokenPayload;
}
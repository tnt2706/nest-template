import * as jwt from 'jsonwebtoken';

/**
 * Token helper
 */
export class TokenHelper {

  /**
   * Signs token helper
   * @param payload - your json object
   * @param secret - your private hash
   * @param expiresIn - seconds
   * @returns
   */
  static async generate(payload : Record<string, any>, secret : string, expiresIn : string) : Promise<{
    token: string,
    expires: number,
  }>{

    const token = await jwt.sign(
      payload,
      secret,
      {
        expiresIn: expiresIn
      }
    );

    const decoded = jwt.decode(token);
    return {
      token: token,
      expires: decoded.exp,
    };
  }

  /**
   * Verifys token helper
   * @param token
   * @param secret
   */
  static async verify<T>(token: string, secret: string) : Promise<T>{
    return new Promise((resolve,reject) => {
      try {
        const payload = jwt.verify(token, secret);
        resolve(payload);
      } catch (error) {
        reject(error);
      }
    })
  }
}

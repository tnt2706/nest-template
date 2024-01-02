import { TokenHelper } from './token.helper';
import * as jwt from 'jsonwebtoken';


describe('TokenHelper', () => {
  it('should return a valid value', async () => {
    const tokenObject = await TokenHelper.generate({
      user_id: '074fe645-80ee-4002-a4fa-84f217ba4aa8',
      user_type: 'admin',
    }, 'r@n40mk3y', 3600);
    console.log(tokenObject);
    expect(tokenObject).toBeTruthy();
  });
  it('should return an error if token is invalid', async () => {
    const token = 'asads';
    const secret = 'random'
    // eg : JsonWebTokenError { name: 'JsonWebTokenError', message: 'jwt malformed' }
    await expect(TokenHelper.verify<any>(token, secret)).rejects.toThrow(jwt.JsonWebTokenError);
  });
  it('should return a payload if token is valid', async () => {
    const tokenObject = await TokenHelper.generate({
      user_id: '123',
      user_type: 'admin',
    }, 'random', 3600);

    const secret = 'random';
    await expect(TokenHelper.verify<any>(tokenObject.token, secret)).resolves.toHaveProperty('iat')
  })
});
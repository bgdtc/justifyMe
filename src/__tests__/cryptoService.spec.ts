import { createToken,verifyJwt } from "../services";
import jwt from 'jsonwebtoken';

const email = 'test@example.com';
const originalEnv = process.env;

describe('CRYPTO SERVICE TEST', () => {
  
  beforeEach(() => {process.env = { ...originalEnv, JWT_SECRET: 'testSecret' }});
  
  afterEach(() => {process.env = originalEnv});
  
  it('createToken and verifyJwt', async () => {
    const token = await createToken(email);
    const decodedToken = await verifyJwt(token);
    expect(decodedToken.email).toBe(email);
  });
  
  it('verifyJwt with expired token', async () => {
    const expiredToken = jwt.sign({ email }, process.env.JWT_SECRET!, { expiresIn: '-1s' });
    await expect(verifyJwt(expiredToken)).rejects.toThrowError('Token expired');
  });
    
  it('should throw an error for an invalid token', async () => {
      const invalidToken = 'invalidToken';
      await expect(verifyJwt(invalidToken)).rejects.toThrowError('Invalid token');
  });
    
  it('should throw an error for a malformed token', async () => {
      const malformedToken = 'malformed.token.string';
      await expect(verifyJwt(malformedToken)).rejects.toThrowError('Invalid token');
  });

  it('should throw a custom error for other errors', async () => {
    const testToken = 'testToken';
    jest.spyOn(jwt, 'verify').mockImplementation((_token, _secret, callback:any) => {
      callback(new Error('Custom error'), undefined);
    });
    await expect(verifyJwt(testToken)).rejects.toThrowError('Authorization error: TypeError: callback is not a function');
  });
});
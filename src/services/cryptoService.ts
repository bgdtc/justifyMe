import jwt from 'jsonwebtoken';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

export const createToken = async (email:string):Promise<string> => await signJwt(email);

const signJwt = async (email:string | object):Promise<string> => jwt.sign({email},process.env.JWT_SECRET!,{expiresIn:'24h'});

export const verifyJwt = async (token:string,secret:string = process.env.JWT_SECRET!) => {
    try {
        const decodedToken:any = jwt.verify(token!,secret);
        return decodedToken; 
    } catch (e:any) {
        if (e instanceof TokenExpiredError) {
            throw new Error('Token expired');
        } else if (e instanceof JsonWebTokenError) {
            throw new Error('Invalid token');
        } else {
            throw new Error('Authorization error: ' + e);
        }
    }
};

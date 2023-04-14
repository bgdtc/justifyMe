import { Request, Response } from 'express';
import { createToken, insertTokenIntoDb } from '../services';
import { mailRgx } from '../utils';

export const getToken = async (req:Request,res:Response) => {
    try {
        if (!req?.body?.email || !mailRgx.test(req?.body?.email)) return res.status(401).send('invalid email');
        const createdToken = await createToken(req?.body?.email);
        const isTokenInsertedInDb = await insertTokenIntoDb(createdToken);
        if (!isTokenInsertedInDb) throw new Error('error inserting token');
        res.status(200).send(createdToken);
    } catch (e) {
        return res.status(401).send('Error: '+ e);
    }
};
import { Request, Response } from 'express';
import { createToken } from '../services';

export const getToken = async (req:Request,res:Response) => {
    return res.status(200).send(await createToken(req?.body?.email));
};
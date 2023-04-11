import { Request, Response } from 'express';

export const getToken = (req:Request,res:Response) => {
    console.log(req?.body);
}
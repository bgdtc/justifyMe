import { Request, Response } from 'express';

export const justify = (req:Request,res: Response) => {
    console.log(req?.params);
}
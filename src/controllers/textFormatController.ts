import { Request, Response } from "express";
import { justifyText } from "../services";
import { checkTokenRateLimit } from "../services";

export const justify = async (req: Request, res: Response) => {

  if (!req?.headers?.authorization) return res.status(401).send('unauthorized');
  if (!req?.body?.text && !req?.query?.text) res.status(401).send('no text provided');
  if (req?.body?.text === '' && req?.query?.text === '') res.status(401).send('empty text provided');

  const text:string = req?.body?.text || req?.query?.text || '';

  let token: string;

  try {
    token = req?.headers?.authorization?.split(' ')[1];
    if (token[0] + token[1] !== 'ey') return res.status(401).send('no authorization provided');    
  } catch (e) {
    return res.status(401).send(e);
  }
  
  const wordCount = (text?.match(/\S+/g) || []).length;

  if (!(await checkTokenRateLimit(token,wordCount))) return res.status(402).send('Payment Required');

  res.set("Content-Type", "text/plain");
  res.status(200).send(justifyText(req?.body?.text));
};

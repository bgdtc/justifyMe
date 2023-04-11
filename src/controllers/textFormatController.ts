import { Request, Response } from "express";
import { justifyText } from "../services";
import { checkTokenRateLimit } from "../services";

export const justify = async (req: Request, res: Response) => {
  // TODO: req.body.text ou req.query.text 
  console.log(req?.body, req?.query);
  if (!req?.headers?.authorization) return res.status(401).send('unauthorized');

  let token: string;

  try {
    token = req?.headers?.authorization?.split(' ')[1];
    if (token[0] + token[1] !== 'ey') return res.status(401).send('no authorization provided');    
  } catch (e) {
    return res.status(401).send(e);
  }
  
  const wordCount = (req?.body?.text?.match(/\S+/g) || []).length;

  if (!(await checkTokenRateLimit(token,wordCount))) return res.status(402).send('Payment Required');

  res.set("Content-Type", "text/plain");
  res.status(200).send(justifyText(req?.body?.text));
};

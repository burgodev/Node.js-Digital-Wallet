import { Request, Response, NextFunction } from "express";
import { setLang } from "../helpers/translate";

export const translate = async (request: Request, response: Response, next: NextFunction) => {

    await setLang((request.headers.lang || process.env.DEFAULT_LANG) as string);

    next();

}
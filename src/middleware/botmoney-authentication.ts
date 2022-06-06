import { Request, Response, NextFunction } from 'express';
import APIError from "../errors/api-error";
import UnauthenticatedError from "../errors/unauthenticated-error";
import botmoneyAuth from '../helpers/botmoney-auth';

export const botmoneyAuthentication = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.body.integration_token;

    if (!token) throw new UnauthenticatedError();

    try {
        req.auth = await botmoneyAuth(token);
        next();
    } catch (error) {
        throw new APIError(error.message);
    }
}

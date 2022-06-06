import { Request, Response, NextFunction } from 'express';
import APIError from "../errors/api-error";
import UnauthenticatedError from "../errors/unauthenticated-error";
import auth from '../helpers/auth';

export const ensureAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) throw new UnauthenticatedError();

    try {
        req.auth = await auth(token);
        next();
    } catch (error) {
        throw new APIError(error.message);
    }
}

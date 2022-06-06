import APIError from '../errors/api-error';
import { Request, Response, NextFunction } from 'express';
import UnauthenticatedError from "../errors/unauthenticated-error";

export function axAuth(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization;

    if (!token) throw new UnauthenticatedError();

    try {
        if (token !== "1a4c593d-e460-43d1-a808-6c7492df3a66") throw new UnauthenticatedError();
        next();
    } catch (error) {
        throw new APIError(error.message);
    }
}

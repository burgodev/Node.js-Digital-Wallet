import { Request, Response, NextFunction } from 'express';
import BaseError from '../errors/base-error';
import { l } from '../helpers/general';
import Res from '../helpers/response';

export const errorHandling = (error: Error | BaseError, request: Request, response: Response, next: NextFunction) => {

    const debug_level = process.env.DEBUG_LEVEL || 'none';

    let httpCode = 500;
    let passthru_message = false;

    l.error(error?.message || 'Error');

    const res = new Res(response);

    if (error instanceof BaseError) {
        httpCode = error.httpCode;
        passthru_message = error.passthru_message;
        if (error.data) {
            res.setData(error.data);
        }
    }
    
    res.setStatus(httpCode);

    switch (debug_level) {
        case 'base':
            res.setMessage(error?.message || 'Error');
            // res.setErrors(error?.message);
            break;
        case 'formatted':
            res.setMessage(error?.message || 'Error');
            res.setErrors(error.stack);
            break;
        case 'full':
            return next(error);
        default: 
            if (passthru_message) {
                res.setMessage(error?.message || 'Ops... something went wrong');
            } else {
                res.setMessage('Ops... something went wrong');
            }
            break;
    }

    res.error();

}

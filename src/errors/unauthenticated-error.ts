import { HttpStatusCode } from '../helpers/response';
import BaseError from "./base-error";

export default class UnauthenticatedError extends BaseError {

    public readonly passthru_message: boolean = true;

    constructor(message = 'auth.not_authenticated', data: any = null, httpCode = HttpStatusCode.UNAUTHORIZED, isOperational = false) {
        super(message, httpCode, isOperational, data);
    }
    
}
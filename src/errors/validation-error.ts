import { HttpStatusCode } from '../helpers/response';
import BaseError from "./base-error";

export default class ValidationError extends BaseError {

    public readonly passthru_message: boolean = true;

    constructor(message = 'Validation error', httpCode = HttpStatusCode.BAD_REQUEST, isOperational = true) {
        super(message, httpCode, isOperational);
    }
    
}
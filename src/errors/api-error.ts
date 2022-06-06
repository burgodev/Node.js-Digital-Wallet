import { HttpStatusCode } from '../helpers/response';
import BaseError from "./base-error";

export default class APIError extends BaseError {

    constructor(message = 'internal server error', httpCode = HttpStatusCode.INTERNAL_SERVER, isOperational = true) {
        super(message, httpCode, isOperational);
    }
    
}
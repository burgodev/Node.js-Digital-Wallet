import { HttpStatusCode } from '../helpers/response';
import BaseError from "./base-error";

export default class NotFoundError extends BaseError {

    constructor(message = 'not found', httpCode = HttpStatusCode.NOT_FOUND, isOperational = true) {
        super(message, httpCode, isOperational);
    }
    
}
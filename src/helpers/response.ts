import { Response } from "express";
import { t, translateExists } from "./translate";
import { l } from "./logs";

export enum HttpStatusCode {
    OK = 200,
    CREATED = 201,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    NOT_FOUND = 404,
    INTERNAL_SERVER = 500,
}

// interface IResponse {
//     message: string,
//     need_translate: boolean,
//     status_code: number,
//     payload?: any,
//     error: boolean,
//     errors?: any,
// }

export const r = (
    res: Response,
    message = "",
    data = {},
    errors: any = null,
    status = HttpStatusCode.OK,
    translate = true
): Response => {
    const r = new Res(res);

    r.setMessage(message, translate).setStatus(status).setData(data);

    if (errors) {
        return r.error(errors);
    } else {
        return r.success(data);
    }
};

export default class Res {
    res: Response;
    message: string;
    translate: boolean;
    data: any;
    status: HttpStatusCode;
    _error: boolean;
    errors: any;

    constructor(res: Response) {
        this.res = res;
        this.message = "";
        this.translate = true;
        this.data = {};
        this.status = HttpStatusCode.OK;
        this._error = false;
        this.errors = null;
    }

    public setMessage(message: string, translate = true): Res {
        this.message = message;
        this.translate = translate;
        return this;
    }

    public setStatus(status: HttpStatusCode): Res {
        this.status = status;
        return this;
    }

    public setData(data: any): Res {
        this.data = data;
        return this;
    }

    public setErrors(errors: any): Res {
        this.errors = errors;
        return this;
    }

    public setError(error: boolean): Res {
        this._error = error;
        return this;
    }

    private response(): Response {
        const message = (this.translate && this.message) ? t(this.message) : this.message;
        return this.res.status(this.status).json({
            message,
            payload: this.data,
            status: this.status,
            error: this._error,
            errors: this.errors,
        });
    }

    public success(data = {}): Response {
        this.setData(data);
        return this.response();
    }

    public error(errors: any = null): Response {
        if (this.errors == null || errors != null) {
            this.setErrors(errors);
        }
        this.setError(true);
        return this.response();
    }

    public validation(errors = {}): Response {
        this.setStatus(HttpStatusCode.BAD_REQUEST);
        return this.error(errors);
    }
}

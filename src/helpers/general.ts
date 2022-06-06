import { v4 as uuidv4 } from "uuid";
import { r as res } from "./response";
import { l as log } from "./logs";
import { t as translate } from "./translate";
import APIError from "../errors/api-error";
import { Request } from "express";

export const r = res;
export const l = log;
export const t = translate;

export const generateUUID = (): string => uuidv4();

export const emptyObj = (obj: any): boolean => Object.keys(obj).length === 0;

export const formatDateToDB = (d: string | Date): string => new Date(d).toISOString();

export function convertToEnum<T>(key: string, e: any, error_msg: string = "enum.not_found"): T {
    const value: T = e[key];
    if (value == undefined) throw new APIError(error_msg);
    return value;
}

export const replacer = (key, value) => {
    if (value instanceof Map) {
        return {
            dataType: "Map",
            value: Array.from(value.entries()), // or with spread: value: [...value]
        };
    } else {
        return value;
    }
};

export const reviver = (key, value) => {
    if (typeof value === "object" && value !== null) {
        if (value.dataType === "Map") {
            return new Map(value.value);
        }
    }
    return value;
};

export const mapToJson = (data: Map<any, any>): string => {
    return JSON.stringify(data, replacer);
};

export const jsonToMap = (data: string): Map<any, any> => {
    return JSON.parse(data, reviver);
};

export const paginationParams = (req: Request): { take: number, skip: number } => {
    const take = req.query.take ? Number(req.query.take) : 10;
    const page = req.query.page ? Number(req.query.page) : 1;

    return {
        take,
        skip: ((page - 1) * take),
    }
}
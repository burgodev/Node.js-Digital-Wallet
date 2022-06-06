import { ILoggedUser } from "../types/auth";
import jwt from "jsonwebtoken";
import fs from "fs";
import { l } from "./general";
import UnauthenticatedError from "../errors/unauthenticated-error";

const auth = async (token): Promise<ILoggedUser> => {
    try {
        const publicKey = fs.readFileSync(`${__dirname}/../certs/public.key`);
        const decoded = await jwt.verify(token, publicKey, { algorithms: ["RS256"] });
        if (typeof decoded === "object") {
            return {
                user_id: decoded.user_id,
                user_role_id: decoded.user_role_id,
            };
        }
    } catch (error) {
        l.error("Error on auth", { message: error.message });
        throw new UnauthenticatedError();
    }
}

export default auth;
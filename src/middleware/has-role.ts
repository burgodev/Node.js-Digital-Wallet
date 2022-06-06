import { Request, Response, NextFunction } from "express";
import APIError from "../errors/api-error";
import UnauthenticatedError from "../errors/unauthenticated-error";
import { l } from "../helpers/general";
import UserRoleRepository from "../repositories/user-role-repository";

/**
 * @param str_role available roles: Client|Manager|Admin|Bussiness|Support
 */
export function hasRole(str_role: string) {
    try {
        const roles = str_role.split("|");

        return async (req: Request, res: Response, next: NextFunction) => {
            const user_role_repository = new UserRoleRepository();

            let has_role = false;
            for (let role of roles) {
                if (has_role) continue;
                has_role = await user_role_repository.userHasRole(req.auth.user_id, role);
            }

            if (has_role) {
                next();
            } else {
                l.warn("User attempt to access a role restricted endpoint", {
                    accepted_roles: roles,
                    user_role: req.auth.user_role_id,
                });

                throw new UnauthenticatedError();
            }
        };
    } catch (error) {
        throw new APIError();
    }
}

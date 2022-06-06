import { Router } from "express";
import PasswordRecoveryController from "../controllers/auth/password-recovery-controller";
import UserRoleController from "../controllers/user-roles-controller";

const user_role_controller = new UserRoleController();
const password_recovery_controller = new PasswordRecoveryController();
const UserRoleRoutes = Router();

UserRoleRoutes.post("/create", user_role_controller.create.bind(user_role_controller));

export default UserRoleRoutes;
